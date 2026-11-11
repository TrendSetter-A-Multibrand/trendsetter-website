import type { Registration } from "@/lib/db/queries/registrations";
import type { Guest } from "@/lib/bonusRarus/loyalty";

/** A few at a time: the list of a big event must not open a hundred calls at once. */
const AT_ONCE = 6;

/**
 * Puts the guests' names, phones and e-mails on the rows that only carry a card
 * number, as the loyalty service has them now. A row whose guest cannot be read
 * (the service is down, the card is gone) is left as it is, nameless - the
 * list still opens. `lookup` is for tests.
 */
export async function withGuests(
  rows: Registration[],
  lookup: (barcode: string) => Promise<Guest | null>,
): Promise<Registration[]> {
  const out = [...rows];
  const todo = out.map((row, i) => ({ row, i })).filter(({ row }) => row.cardBarcode && !row.name && !row.phone);

  let next = 0;
  async function worker() {
    while (next < todo.length) {
      const { row, i } = todo[next++];
      const guest = await lookup(row.cardBarcode).catch(() => null);
      if (guest) out[i] = { ...row, name: guest.name, phone: guest.phone, email: guest.email };
    }
  }
  await Promise.all(Array.from({ length: Math.min(AT_ONCE, todo.length) }, worker));
  return out;
}
