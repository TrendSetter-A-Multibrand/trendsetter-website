import { describe, expect, it } from "vitest";
import { hasProfanity } from "@/lib/profanity";

describe("hasProfanity", () => {
  it("находит прямую брань, в том числе с приставкой, латиницей и растянутыми буквами", () => {
    for (const text of ["это полный пиздец", "вы все охуели", "Заебали уже", "ну ты и мудак", "xуйня", "бляяяя", "Сука!"]) {
      expect(hasProfanity(text), text).toBe(true);
    }
  });

  it("не трогает обычные слова, в которых те же буквы", () => {
    for (const text of [
      "Хочу хлеб и небо",
      "потребитель и употребление",
      "хулиган и хуторок",
      "страховка, подъезд, мудрость",
      "оскорбление не допускается",
      "хуже, чем худой",
      "Здравствуйте, у меня вопрос про магазин.",
    ]) {
      expect(hasProfanity(text), text).toBe(false);
    }
  });

  it("знает слова из списка команды, в обеих записях «ё»", () => {
    for (const text of ["какая мразь", "полное говно", "Хуёвый сервис", "хуевый сервис", "ну ты дебил", "эта стерва", "ёбаный"]) {
      expect(hasProfanity(text), text).toBe(true);
    }
  });

  it("находит английскую брань и фразы из нескольких слов", () => {
    for (const text of ["what the fuck", "This is bullshit", "you ASSHOLE", "fuuuuck", "son of a bitch", "just piss off, ok", "stfu"]) {
      expect(hasProfanity(text), text).toBe(true);
    }
  });

  it("не трогает обычные английские слова", () => {
    for (const text of ["class assessment", "Hello, assistant", "I wear a shoe", "Scunthorpe", "passion for peace", "cocktail party", "I can piss"]) {
      expect(hasProfanity(text), text).toBe(text === "I can piss");
    }
  });
});
