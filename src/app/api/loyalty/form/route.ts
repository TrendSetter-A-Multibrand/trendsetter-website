import { BonusRarusError } from "@/lib/bonusRarus/loyalty";
import { registrationForm } from "@/lib/bonusRarus/registrationForm";

/** The registration fields the cabinet asks for - names and rules only, nothing about anyone. */
export async function GET() {
  try {
    return Response.json({ fields: await registrationForm() });
  } catch (e) {
    const status = e instanceof BonusRarusError && e.status < 500 ? 400 : 502;
    return Response.json({ error: "Система лояльности временно недоступна." }, { status });
  }
}
