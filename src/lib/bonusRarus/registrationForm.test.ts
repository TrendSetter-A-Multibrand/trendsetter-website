import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/bonusRarus/client", () => ({ bonusRarus: vi.fn(), BonusRarusError: class extends Error {} }));

import { throwawayPassword, toFormFields, toRegistrationBody } from "@/lib/bonusRarus/registrationForm";

// The demo cabinet's list, as `personal-account/settings` returned it on 2026-10-28
const DEMO = [
  { id: "client-property-3", name: "Семейное положение - женат/замужем", type: "boolean", required: true },
  {
    id: "gender",
    name: "Пол",
    type: "string",
    required: false,
    valid_values: [
      { id: "male", name: "Мужской" },
      { id: "female", name: "Женский" },
      { id: "undefined", name: "Не указан" },
    ],
  },
  { id: "name", name: "Имя", type: "string", required: true },
  { id: "phone", name: "Номер телефона", type: "int64", required: true },
  { id: "email", name: "Email", type: "string", required: false },
  { id: "birthday", name: "День рождения", type: "string", required: false },
];

describe("toFormFields", () => {
  it("ставит поля в привычном порядке и узнаёт их вид", () => {
    const fields = toFormFields(DEMO);
    expect(fields.map((f) => [f.id, f.kind, f.required])).toEqual([
      ["name", "text", true],
      ["phone", "phone", true],
      ["email", "email", false],
      ["birthday", "date", false],
      ["gender", "choice", false],
      ["client-property-3", "bool", true],
    ]);
  });

  it("не показывает поля, которые сайт не умеет отправить", () => {
    expect(toFormFields([{ id: "passport", name: "Паспорт", required: true }])).toEqual([]);
  });

  it("пароль, если кабинет его требует, показывает как поле пароля", () => {
    expect(toFormFields([{ id: "password", name: "Пароль", required: true }])).toEqual([
      { id: "password", name: "Пароль", kind: "password", required: true },
    ]);
  });
});

describe("toRegistrationBody", () => {
  const fields = toFormFields(DEMO);
  const filled = { name: " Анна ", phone: "8 999 000-00-01", "client-property-3": "false" };

  it("собирает тело запроса, свойство уходит в properties, «Нет» — это false", () => {
    expect(toRegistrationBody(fields, { ...filled, birthday: "1990-05-17", gender: "female" })).toEqual({
      ok: true,
      body: {
        name: "Анна",
        phone: "79990000001",
        gender: "female",
        birthday: Date.UTC(1990, 4, 17),
        properties: [{ prop_id: 3, type: "bool", value: false }],
      },
    });
  });

  it("пол не указан — отправляет undefined, как требует API", () => {
    const out = toRegistrationBody(fields, filled);
    expect(out.ok && out.body.gender).toBe("undefined");
  });

  it("называет незаполненные обязательные поля", () => {
    expect(toRegistrationBody(fields, { name: "Анна" })).toEqual({
      ok: false,
      error: "Заполните: Номер телефона, Семейное положение - женат/замужем",
    });
  });

  it("отклоняет неверный телефон, e-mail, вариант и будущую дату", () => {
    expect(toRegistrationBody(fields, { ...filled, phone: "123" }).ok).toBe(false);
    expect(toRegistrationBody(fields, { ...filled, email: "anna@" }).ok).toBe(false);
    expect(toRegistrationBody(fields, { ...filled, gender: "other" }).ok).toBe(false);
    expect(toRegistrationBody(fields, { ...filled, birthday: "2999-01-01" }).ok).toBe(false);
  });

  it("не пропускает свойства, которых нет в кабинете", () => {
    const out = toRegistrationBody(fields, { ...filled, "client-property-99": "true" });
    expect(out.ok && out.body.properties).toEqual([{ prop_id: 3, type: "bool", value: false }]);
  });
});

describe("пароль при регистрации", () => {
  const fields = toFormFields([
    { id: "name", name: "Имя", required: true },
    { id: "phone", name: "Номер телефона", type: "int64", required: true },
    { id: "password", name: "Пароль", required: true },
  ]);

  it("уходит в тело запроса, если подходит по длине", () => {
    expect(toRegistrationBody(fields, { name: "Анна", phone: "89990000001", password: "secret1" })).toMatchObject({
      ok: true,
      body: { password: "secret1" },
    });
    expect(toRegistrationBody(fields, { name: "Анна", phone: "89990000001", password: "123" })).toEqual({
      ok: false,
      error: "Пароль: от 6 до 64 символов",
    });
  });

  it("для гостя события пароль придумывается и подходит под правило", () => {
    const password = throwawayPassword();
    expect(toRegistrationBody(fields, { name: "Анна", phone: "89990000001", password }).ok).toBe(true);
    expect(throwawayPassword()).not.toBe(password);
  });
});
