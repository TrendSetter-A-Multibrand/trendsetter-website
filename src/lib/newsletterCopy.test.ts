import { describe, expect, it } from "vitest";
import { newsletterCopy } from "@/lib/newsletterCopy";

describe("слова подписки", () => {
  it("старый заголовок и описание из первого сида уступают словам макета", () => {
    expect(
      newsletterCopy(
        "Подпишитесь на наши новости",
        "Будьте в числе первых, кто узнает о новинках,\nраспрождажах и интересных новостях TRENDSETTER!",
      ),
    ).toEqual({ heading: undefined, description: undefined });
  });

  it("слова, которые написал редактор, остаются", () => {
    expect(newsletterCopy("Пишем редко", "Раз в месяц.")).toEqual({
      heading: "Пишем редко",
      description: "Раз в месяц.",
    });
  });

  it("пустые поля остаются пустыми", () => {
    expect(newsletterCopy(undefined, undefined)).toEqual({ heading: undefined, description: undefined });
  });
});
