import { afterEach, describe, expect, it, vi } from "vitest";
import {
  BonusRarusError,
  confirmLogin,
  fetchFile,
  googleWalletLink,
  loadCabinet,
  maskPhone,
  SessionExpired,
  startLogin,
  toCabinet,
} from "@/lib/bonusRarus/customer";

/** One canned answer per call, in the order the code makes them. */
function answer(...bodies: unknown[]) {
  const fetchMock = vi.fn();
  for (const body of bodies) {
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify(body), { headers: { "Content-Type": "application/json" } }));
  }
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

afterEach(() => vi.unstubAllGlobals());

describe("maskPhone", () => {
  it("оставляет код оператора и две последние цифры", () => {
    expect(maskPhone("79992979324")).toBe("+7 (999) ***-**-24");
    expect(maskPhone("123")).toBe("");
  });
});

describe("startLogin", () => {
  it("отправляет телефон и возвращает секрет кода", async () => {
    const fetchMock = answer({ success: true, data: { client_id: 111, secret: "s", channel: "phone", code_length: 6, duration: 120 } });
    await expect(startLogin("79990000001")).resolves.toEqual({
      clientId: 111,
      secret: "s",
      channel: "phone",
      codeLength: 6,
      duration: 120,
    });
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({ identity: "79990000001" });
  });

  it("«Клиент не найден» - это путь к анкете, а не ошибка", async () => {
    // As the live demo answers it
    answer({
      success: false,
      message: "Клиент не найден",
      customer_message: "Клиент не найден",
      error: { class: "database", type: "apierror.ErrorNotFound", reason: "unknown" },
    });
    await expect(startLogin("79990000001")).resolves.toBe("not_found");
    // As the vendor's own cabinet expects it
    answer({ success: false, message: "x", error: { reason: "Клиент не найден" } });
    await expect(startLogin("79990000001")).resolves.toBe("not_found");
  });

  it("другие отказы сервиса остаются ошибкой с текстом для покупателя", async () => {
    answer({ success: false, customer_message: "Сервис недоступен", error: { reason: "boom" } });
    await expect(startLogin("79990000001")).rejects.toMatchObject({ customerMessage: "Сервис недоступен" });
  });
});

describe("confirmLogin", () => {
  const pending = { secret: "s", clientId: 111, channel: "phone", codeLength: 6, duration: 120 };

  it("передаёт код и секрет в теле запроса и отдаёт токен клиента", async () => {
    const fetchMock = answer({ success: true, data: { access_token: "t", expire_at: 5 } });
    await expect(confirmLogin("79990000001", pending, "123456")).resolves.toEqual({ token: "t", expireAt: 5 });
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({
      client_id: 111,
      identity: "79990000001",
      secret: "s",
      code: "123456",
    });
  });

  it("неверный код - ошибка с текстом сервиса", async () => {
    answer({ success: false, customer_message: "Неверный код", error: { reason: "wrong code" } });
    const error = await confirmLogin("79990000001", pending, "111111").catch((e) => e);
    expect(error).toBeInstanceOf(BonusRarusError);
    expect(error.customerMessage).toBe("Неверный код");
  });
});

describe("loadCabinet", () => {
  it("истёкший токен - SessionExpired, а не сбой", async () => {
    const bad = { success: false, message: "Некорректный токен доступа" };
    answer(bad, bad, bad, bad, bad, { success: true, data: {} });
    await expect(loadCabinet("old")).rejects.toBeInstanceOf(SessionExpired);
  });

  it("шлёт токен клиента с префиксом Bearer", async () => {
    const fetchMock = answer(
      { success: true, data: { id: 1, phone: "79990000001", default_card_id: 2 } },
      { success: true, data: [{ id: 2, barcode: "0000000002", state: "active" }] },
      { success: true, data: [] },
      { success: true, data: [] },
      { success: true, data: { objects: null } },
      { success: true, data: {} },
    );
    await loadCabinet("abc");
    expect(fetchMock.mock.calls[0][1].headers.Authorization).toBe("Bearer abc");
  });
});

describe("toCabinet", () => {
  const now = Date.UTC(2026, 9, 30);

  it("берёт основную карту, её выгоду и ближайшее сгорание", () => {
    const cabinet = toCabinet({
      client: { id: 1, name: "Аня", phone: "79990000001", email: "a@b.ru", default_card_id: 2 },
      cards: [
        { id: 1, barcode: "1", state: "inactive" },
        { id: 2, barcode: "0000000002", balance: 150, state: "active", card_level: { name: "Gold" } },
      ],
      profit: [
        { card_id: 1, sale_sum: 999 },
        { card_id: 2, sale_sum: 12000, sale_count: 3, bonus_added_sum: 600, bonus_removed_sum: 450 },
      ],
      expires: [
        {
          card_id: 2,
          bonus_expires: [
            { amount: 50, date: now + 10 * 864e5 },
            { amount: 20, date: now + 2 * 864e5 },
            { amount: 0, date: now + 864e5 },
          ],
        },
      ],
      records: [
        { type: "transaction", transaction: { id: "t1", event_date: now - 864e5, amount: -100, description: "" } },
        {
          type: "document",
          document: { id: "d1", event_date: now, operation: "sale", shop_name: "Мозаика", total_with_discounts: 4000, bonus_added: 200 },
        },
      ],
      settings: { apple_wallet_configured: true },
      now,
    });

    expect(cabinet.card).toEqual({ id: 2, barcode: "0000000002", balance: 150, level: "Gold", active: true });
    expect(cabinet.year).toEqual({ spent: 12000, purchases: 3, earned: 600, used: 450 });
    expect(cabinet.nextExpiry).toEqual({ amount: 20, date: now + 2 * 864e5 });
    expect(cabinet.phone).toBe("+7 (999) ***-**-01");
    expect(cabinet.history.map((r) => r.title)).toEqual(["Покупка · Мозаика", "Списание баллов"]);
    expect(cabinet.history[0]).toMatchObject({ sum: 4000, points: 200 });
    expect(cabinet.wallets).toEqual({ apple: true, google: false });
  });

  it("новый клиент без покупок - пустая история и нули", () => {
    const cabinet = toCabinet({
      client: { id: 1 },
      cards: [{ id: 5, barcode: "5", state: "active" }],
      profit: [],
      expires: [{ card_id: 5, bonus_expires: null }],
      records: null,
      settings: {},
      now,
    });
    expect(cabinet.history).toEqual([]);
    expect(cabinet.nextExpiry).toBeNull();
    expect(cabinet.year).toEqual({ spent: 0, purchases: 0, earned: 0, used: 0 });
  });
});

describe("fetchFile", () => {
  it("оборванное соединение повторяет, а не отдаёт ошибку", async () => {
    const fetchMock = vi
      .fn()
      .mockRejectedValueOnce(new TypeError("terminated"))
      .mockResolvedValueOnce(new Response(new Uint8Array([1, 2, 3]), { headers: { "Content-Type": "application/vnd.apple.pkpass" } }));
    vi.stubGlobal("fetch", fetchMock);
    const { body } = await fetchFile("https://x/applepass", {});
    expect(body.byteLength).toBe(3);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("после трёх неудач сдаётся", async () => {
    const fetchMock = vi.fn().mockRejectedValue(new TypeError("terminated"));
    vi.stubGlobal("fetch", fetchMock);
    await expect(fetchFile("https://x/applepass", {})).rejects.toThrow("terminated");
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });
});

describe("googleWalletLink", () => {
  it("берёт только ссылку pay.google.com", async () => {
    answer({ success: true, data: { link: "https://pay.google.com/gp/v/save/xyz" } });
    await expect(googleWalletLink("t", 1)).resolves.toBe("https://pay.google.com/gp/v/save/xyz");
  });

  it("чужую ссылку не принимает", async () => {
    answer({ success: true, data: { link: "https://evil.example/save" } });
    await expect(googleWalletLink("t", 1)).rejects.toBeInstanceOf(BonusRarusError);
  });
});
