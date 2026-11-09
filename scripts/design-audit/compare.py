import json,re,sys,io
S=sys.argv[1]
fig=json.load(open(S+"/figma_texts.json",encoding="utf8"))
dom=json.load(open(S+"/dom_all.json",encoding="utf8"))
def norm(s): return re.sub(r"\s+"," ",s.replace("\u00a0"," ")).strip().lower()
out=io.StringIO()
def P(*a): print(*a,file=out)
totals=[]
for key in fig:
    if key not in dom: P(f"## {key}: нет данных DOM"); continue
    F=fig[key]; D=dom[key]
    used=set(); matches=[]; unmatched=[]
    cands={}
    for i,d in enumerate(D["items"]): cands.setdefault(norm(d["t"]),[]).append(i)
    off=0.0
    for f in sorted([t for t in F["texts"] if t["y"]>40 and len(t["t"].strip())>1],key=lambda t:(t["y"],t["x"])):
        k=norm(f["t"])
        lst=[i for i in cands.get(k,[]) if i not in used]
        if not lst: unmatched.append(f); continue
        fm=f["y"]+f["h"]/2
        best=min(lst,key=lambda i:abs((D["items"][i]["y"]+D["items"][i]["h"]/2)-fm-off))
        used.add(best); d=D["items"][best]
        dm=(d["y"]+d["h"]/2)-fm
        off=dm
        # horizontal: best of left / centre / right
        dxl=d["x"]-f["x"]; dxc=(d["x"]+d["w"]/2)-(f["x"]+f["w"]/2); dxr=(d["x"]+d["w"])-(f["x"]+f["w"])
        dx=min((dxl,dxc,dxr),key=abs)
        matches.append(dict(f=f,d=d,dm=dm,dx=dx,dxl=dxl))
    P(f"\n## {key}  (Figma {F['w']:.0f}x{F['h']:.0f} -> сайт {D['w']}x{D['h']}; высота {D['h']-F['h']:+.0f})")
    P(f"совпало текстов: {len(matches)} из {len(matches)+len(unmatched)}; не найдено на сайте: {len(unmatched)}")
    fs=[m for m in matches if m['f']['fs'] and abs(m['d']['fs']-m['f']['fs'])>=0.6]
    fw=[m for m in matches if m['f']['fw'] and abs(m['d']['fw']-m['f']['fw'])>=150]
    xx=[m for m in matches if abs(m['dx'])>2.5]
    # vertical jumps
    jumps=[];prev=None
    for m in matches:
        if prev is not None and abs(m['dm']-prev['dm'])>4: jumps.append((prev,m))
        prev=m
    P(f"размер шрифта отличается: {len(fs)}; жирность: {len(fw)}; сдвиг по X > 2.5px: {len(xx)}; скачков по Y: {len(jumps)}")
    def short(m): return f"«{m['f']['t'][:38].strip()}» "
    for m in fs[:8]: P(f"  шрифт {short(m)} макет {m['f']['fs']:.0f}/{m['f']['lh'] and round(m['f']['lh'])} сайт {m['d']['fs']:.0f}/{m['d']['lh'] and round(m['d']['lh'])}")
    for m in fw[:5]: P(f"  жирность {short(m)} макет {m['f']['fw']} сайт {m['d']['fw']}")
    for m in xx[:8]: P(f"  X {short(m)} сдвиг {m['dx']:+.0f}px (макет x={m['f']['x']:.0f}, сайт x={m['d']['x']:.0f}) y≈{m['f']['y']:.0f}")
    for a,b in jumps[:8]: P(f"  Y со «{a['f']['t'][:26].strip()}» (y={a['f']['y']:.0f}, сдвиг {a['dm']:+.0f}) к «{b['f']['t'][:26].strip()}» (y={b['f']['y']:.0f}, сдвиг {b['dm']:+.0f}): изменение {b['dm']-a['dm']:+.0f}px")
    if unmatched:
        P("  нет на сайте: "+" | ".join(u['t'][:28].strip().replace("\n"," ") for u in unmatched[:10]))
    totals.append((key,len(matches),len(F['texts']),len(fs),len(xx),len(jumps)))
P("\n# Итог")
for t in totals: P("%-12s совпало %3d/%3d  шрифт:%2d  X:%2d  скачков Y:%2d"%t)
open(S+"/report.txt","w",encoding="utf8").write(out.getvalue())
print("ok")
