/**
 * Talks to "1С-Рарус: Система управления лояльностью" - server only, the
 * registration token never reaches the browser. It uses the site's own API,
 * `web-flow`, in our space `p131` (override with BONUS_RARUS_SPACE); the token
 * is the "Сайт" (web) integration's, made in Настройки -> Интеграции.
 */

const SPACE = process.env.BONUS_RARUS_SPACE || "p131";
const BASE = `https://backend-pro.bonus-rarus.ru/${SPACE}/web-flow`;
const AUTH_URL = `https://backend-pro.bonus-rarus.ru/${SPACE}/integration-module/auth`;

export class BonusRarusError extends Error {
  constructor(
    readonly status: number,
    readonly customerMessage: string,
    message: string,
  ) {
    super(message);
  }
}

type Envelope<T> = { success: boolean; message?: string; customer_message?: string; data: T };

async function call<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    cache: "no-store",
    headers: { "Content-Type": "application/json", ...init.headers },
  });
  const body = (await res.json().catch(() => null)) as Envelope<T> | null;
  if (!res.ok || !body?.success) {
    throw new BonusRarusError(
      res.status,
      body?.customer_message || "Не удалось выполнить операцию. Попробуйте ещё раз.",
      body?.message || `${res.status} on ${path}`,
    );
  }
  return body.data;
}

/**
 * The temporary access token, cached for the process's lifetime (the only
 * lifetime a serverless function has anyway): `POST /integration-module/auth`
 * trades the registration token for one good until `expire_at`, and asking
 * again before then would just register the same module a second time.
 */
let cached: { token: string; expireAt: number } | null = null;

async function accessToken(): Promise<string> {
  if (cached && cached.expireAt - 60_000 > Date.now()) return cached.token;

  const registration = process.env.BONUS_RARUS_REGISTRATION_TOKEN;
  if (!registration) {
    throw new BonusRarusError(503, "Система лояльности временно недоступна.", "BONUS_RARUS_REGISTRATION_TOKEN не задан");
  }

  const res = await fetch(AUTH_URL, {
    method: "POST",
    cache: "no-store",
    headers: { "Content-Type": "application/json", Authorization: registration },
    body: JSON.stringify({ id: "trendsetter-website", version: "0.1.0", meta: { site: "trendsetter" } }),
  });
  const body = (await res.json().catch(() => null)) as Envelope<{ content: string; expire_at: number }> | null;
  if (!res.ok || !body?.success) {
    throw new BonusRarusError(502, "Система лояльности временно недоступна.", `auth -> ${res.status}`);
  }

  cached = { token: body.data.content, expireAt: body.data.expire_at };
  return cached.token;
}

/** A call with the access token already attached. */
export async function bonusRarus<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = await accessToken();
  return call<T>(path, { ...init, headers: { Authorization: token, ...init.headers } });
}
