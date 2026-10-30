import { afterEach, describe, expect, it, vi } from "vitest";
import { disabled } from "@/lib/bonusRarus/routeKit";

afterEach(() => vi.unstubAllEnvs());

describe("disabled", () => {
  it("без web-токена демо кабинета нет: маршруты отвечают 404", () => {
    vi.stubEnv("BONUS_RARUS_REGISTRATION_TOKEN_WEB", "");
    expect(disabled()?.status).toBe(404);
  });

  it("с web-токеном маршруты работают", () => {
    vi.stubEnv("BONUS_RARUS_REGISTRATION_TOKEN_WEB", "x");
    expect(disabled()).toBeNull();
  });
});
