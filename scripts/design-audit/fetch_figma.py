import json,sys,time,urllib.request,os
tok=sys.argv[1]; out=sys.argv[2]
FRAMES={
 "home":("4348:3","4348:630"),"journal":("4348:1473","4348:1755"),"news":("4353:1998","4353:2374"),
 "article":("4353:2903","4353:3220"),"events":("4353:3645","4353:3923"),"event":("4353:4391","4353:4664"),
 "stores":("4354:3858","4354:4262"),"brands":("4354:4760","4354:5026"),"about":("4354:5559","4354:5869"),
 "space":("4354:6304","4354:6583"),"collabs":("4354:7128","4354:7359"),"contacts":("4354:7697","4354:7900"),
 "careers":("4357:6588","4357:6806"),"loyalty":("4357:7170","4357:7325"),"giftcards":("4357:7581","4357:7736"),
 "faq":("4357:7992","4357:8235"),"search":("4357:8601","4357:8832"),"notfound":("4357:9252","4357:9433"),
 "legal":("4357:9758","4357:9957"),
}
def get(ids):
    req=urllib.request.Request("https://api.figma.com/v1/files/uLa1QBqtuT4HbbhG9vS77s/nodes?ids="+ids,headers={"X-Figma-Token":tok})
    return json.load(urllib.request.urlopen(req,timeout=120))
def walk(n,ox,oy,acc,vis=True):
    vis=vis and n.get("visible",True)
    b=n.get("absoluteBoundingBox")
    if n["type"]=="TEXT" and vis and b and n.get("characters","").strip():
        st=n.get("style",{})
        acc.append({"t":n["characters"],"x":b["x"]-ox,"y":b["y"]-oy,"w":b["width"],"h":b["height"],"fs":st.get("fontSize"),"fw":st.get("fontWeight"),"lh":st.get("lineHeightPx"),"ff":st.get("fontFamily"),"name":n["name"]})
    for c in n.get("children",[]): walk(c,ox,oy,acc,vis)
res={}
for key,(d,m) in FRAMES.items():
    for dev,fid in (("d",d),("m",m)):
        for attempt in range(3):
            try:
                data=get(fid)["nodes"][fid]["document"]; break
            except Exception as e:
                time.sleep(3)
        b=data["absoluteBoundingBox"]; acc=[]
        walk(data,b["x"],b["y"],acc)
        res[f"{key}-{dev}"]={"id":fid,"w":b["width"],"h":b["height"],"texts":acc}
        print(key,dev,len(acc),flush=True)
        time.sleep(0.4)
json.dump(res,open(out,"w",encoding="utf8"),ensure_ascii=False)
