import { describe, expect, it } from "vitest";
import { seo } from "@/lib/seo";

describe("seo", () => {
  it("ставит канонический адрес и оба рынка", () => {
    const meta = seo({ title: "Журнал", path: "/journal", locale: "ru_ru" });
    expect(meta.alternates?.canonical).toBe("/ru_ru/journal");
    expect(meta.alternates?.languages).toEqual({
      // Языковые метки, а не наши имена рынков: ru_ru поиску ничего не говорит
      "ru-RU": "/ru_ru/journal",
      "ru-AM": "/ru_am/journal",
    });
  });

  /**
   * Из-за этого главная какое-то время выходила вообще без заголовка: явный
   * undefined перебивает default из корневого layout, а отсутствие ключа - нет.
   */
  it("без заголовка не отдаёт ключ title вовсе", () => {
    expect("title" in seo({ locale: "ru_ru" })).toBe(false);
    expect("title" in seo({ title: "", locale: "ru_ru" })).toBe(false);
    expect("title" in seo({ title: "Бренды", locale: "ru_ru" })).toBe(true);
  });

  it("подставляет общее описание, когда своего нет", () => {
    expect(seo({ locale: "ru_ru" }).description).toContain("TRENDSETTER");
    expect(seo({ description: "   ", locale: "ru_ru" }).description).toContain(
      "TRENDSETTER"
    );
    expect(seo({ description: "Своё", locale: "ru_ru" }).description).toBe("Своё");
  });

  it("берёт своё фото, когда оно есть, и общее, когда нет", () => {
    const own = seo({ image: "/images/a.jpg", locale: "ru_ru" });
    expect(own.openGraph?.images).toEqual([{ url: "/images/a.jpg" }]);
    expect(seo({ locale: "ru_ru" }).openGraph?.images).toEqual([
      { url: "/images/home/hero.jpg" },
    ]);
  });

  it("на корне обходится без хвоста в адресе", () => {
    expect(seo({ locale: "ru_am" }).alternates?.canonical).toBe("/ru_am");
  });
});
