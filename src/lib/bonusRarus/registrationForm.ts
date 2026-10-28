import { bonusRarus } from "@/lib/bonusRarus/client";
import { normalizePhone } from "@/lib/bonusRarus/loyalty";

/**
 * One field of the cabinet's registration form, as the site draws it. What is
 * asked and what is required is decided in the cabinet (Клиенты -> Личный
 * кабинет клиента -> Поля регистрации), not here: the demo's own list has
 * «Семейное положение» as a required yes/no, a real space will have its own.
 */
export type FormField = {
  id: string;
  name: string;
  kind: "text" | "phone" | "email" | "date" | "number" | "bool" | "choice";
  required: boolean;
  options?: { id: string; name: string }[];
};

type RegField = {
  id: string;
  name: string;
  type?: string;
  required?: boolean;
  valid_values?: (string | { id: string; name: string })[] | null;
};

const PROPERTY = /^client-property-(\d+)$/;

function kindOf(field: RegField, options: FormField["options"]): FormField["kind"] {
  if (field.id === "phone") return "phone";
  if (field.id === "email") return "email";
  if (field.id === "birthday") return "date";
  if (options?.length) return "choice";
  switch (field.type) {
    case "bool":
    case "boolean":
      return "bool";
    case "date":
      return "date";
    case "number":
    case "int64":
      return "number";
    default:
      return "text";
  }
}

// The order a person expects to fill them in, whatever order the cabinet lists them
const RANK: Record<string, number> = { name: 0, phone: 1, email: 2, birthday: 3, gender: 4 };

/** The cabinet's `registration_fields` -> what the form draws. Fields the site cannot send are dropped. */
export function toFormFields(raw: RegField[]): FormField[] {
  return raw
    .filter((f) => f.id in RANK || PROPERTY.test(f.id))
    .map((f) => {
      const options = f.valid_values?.map((v) => (typeof v === "string" ? { id: v, name: v } : v));
      return {
        id: f.id,
        name: f.name,
        kind: kindOf(f, options),
        // The API itself refuses a client without these two, whatever the cabinet says
        required: Boolean(f.required) || f.id === "name" || f.id === "phone",
        ...(options?.length ? { options } : {}),
      };
    })
    .sort((a, b) => (RANK[a.id] ?? 9) - (RANK[b.id] ?? 9));
}

/**
 * The form, cached for a few minutes: it changes only when someone edits the
 * cabinet, and the register route checks every submission against it too.
 *
 * TRANSITION: `personal-account/settings` exists only in `default-flow`; the
 * site flow has no such call. Once a site token replaces the demo one, the
 * field list has to come from somewhere else - asking the vendor how is on the
 * question list.
 */
let cached: { fields: FormField[]; at: number } | null = null;

export async function registrationForm(): Promise<FormField[]> {
  if (cached && Date.now() - cached.at < 5 * 60_000) return cached.fields;
  const data = await bonusRarus<{ settings?: { registration_fields?: RegField[] | null } }>(
    "/personal-account/settings",
  );
  const fields = toFormFields(data.settings?.registration_fields ?? []);
  cached = { fields, at: Date.now() };
  return fields;
}

/** "1990-05-17" -> that day's midnight UTC in ms, the shape the API keeps dates in. */
function dayToMs(value: string): number | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!m) return null;
  const ms = Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return Number.isNaN(ms) || ms > Date.now() ? null : ms;
}

export type RegistrationBody = {
  name: string;
  phone?: string;
  email?: string;
  gender: string;
  birthday?: number;
  properties?: { prop_id: number; type: string; value: string | number | boolean }[];
};

/**
 * What the person typed, checked against the cabinet's fields and shaped for
 * `POST /client`. Only fields the cabinet declares are read - a property id
 * the browser made up never reaches the API. `gender` always goes out: the API
 * requires it even where the cabinet calls it optional, and "undefined" is the
 * API's own word for "не указан".
 */
export function toRegistrationBody(
  fields: FormField[],
  values: Record<string, unknown>,
): { ok: true; body: RegistrationBody } | { ok: false; error: string } {
  const body: RegistrationBody = { name: "", gender: "undefined" };
  const missing: string[] = [];

  for (const field of fields) {
    const raw = values[field.id];
    const text = typeof raw === "string" ? raw.trim() : "";
    if (!text) {
      if (field.required) missing.push(field.name);
      continue;
    }

    let value: string | number | boolean;
    switch (field.kind) {
      case "phone": {
        const phone = normalizePhone(text);
        if (!phone) return { ok: false, error: "Проверьте номер телефона" };
        value = phone;
        break;
      }
      case "email":
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)) return { ok: false, error: "Проверьте e-mail" };
        value = text;
        break;
      case "date": {
        const ms = dayToMs(text);
        if (ms === null) return { ok: false, error: `Проверьте поле «${field.name}»` };
        value = ms;
        break;
      }
      case "number":
        if (!Number.isFinite(Number(text))) return { ok: false, error: `Проверьте поле «${field.name}»` };
        value = Number(text);
        break;
      case "bool":
        if (text !== "true" && text !== "false") return { ok: false, error: `Проверьте поле «${field.name}»` };
        value = text === "true";
        break;
      case "choice":
        if (!field.options?.some((o) => o.id === text)) return { ok: false, error: `Проверьте поле «${field.name}»` };
        value = text;
        break;
      default:
        value = text.slice(0, 200);
    }

    const prop = PROPERTY.exec(field.id);
    if (prop) {
      // The property types the API knows: bool, date, number, string
      const type = field.kind === "bool" || field.kind === "date" || field.kind === "number" ? field.kind : "string";
      (body.properties ??= []).push({ prop_id: Number(prop[1]), type, value });
    } else if (field.id === "birthday") {
      body.birthday = value as number;
    } else {
      (body as Record<string, unknown>)[field.id] = value;
    }
  }

  if (missing.length) return { ok: false, error: `Заполните: ${missing.join(", ")}` };
  return { ok: true, body };
}
