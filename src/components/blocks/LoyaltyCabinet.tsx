import { Facts } from "@/components/cards/Facts";
import { Wordmark } from "@/components/ui/Wordmark";
import { buttonClass } from "@/components/ui/Button";
import { LoyaltyLogout } from "@/components/blocks/LoyaltyLogout";
import type { Cabinet } from "@/lib/bonusRarus/customer";

const number = new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 2 });
const day = new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Moscow" });
const short = new Intl.DateTimeFormat("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "Europe/Moscow" });

/** "1 балл", "3 балла", "15 баллов" */
function points(n: number) {
  const abs = Math.abs(Math.trunc(n));
  const tail = abs % 100 >= 11 && abs % 100 <= 14 ? "баллов" : ["баллов", "балл", "балла", "балла", "балла"][abs % 10] ?? "баллов";
  return `${number.format(n)} ${tail}`;
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-2 bg-surface p-4 md:p-6">
      <span className="type-caption text-text-2">{label}</span>
      <span className="type-h3">{value}</span>
    </div>
  );
}

/**
 * DEMO: the client's cabinet in the site's own look, on the vendor's test
 * space - no Figma frame for it yet, so it is put together from the file's
 * parts: the card in Red with the logotype, its barcode on white (the format
 * the tills read, drawn by the service), the year in three figures, the
 * profile as Facts and the history as rows. Wallet buttons only appear once
 * the service says the wallet is set up; in the demo neither is.
 */
export function LoyaltyCabinet({ cabinet }: { cabinet: Cabinet }) {
  const { card } = cabinet;

  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:gap-6">
      <div className="flex flex-col gap-4 lg:col-span-5">
        {card ? (
          <>
            <div className="flex aspect-[1.586] flex-col justify-between bg-brand p-6 text-white">
              <div className="flex items-start justify-between gap-4">
                <span className="w-[176px]">
                  <Wordmark />
                </span>
                {card.level && <span className="type-label">{card.level}</span>}
              </div>
              <div className="flex flex-col gap-1">
                <span className="type-caption opacity-80">Баланс</span>
                <span className="type-h1">{points(card.balance)}</span>
              </div>
            </div>

            <div className="flex flex-col items-center gap-3 border border-line bg-white p-6">
              {/* The service draws Code128 square whatever height is asked for, and its own
                  cabinet stretches it to 3:2 - harmless for bars, which only get shorter.
                  A QR template would need this back to a square. */}
              {/* eslint-disable-next-line @next/next/no-img-element -- drawn per client by the service, behind their session */}
              <img
                src={`/api/loyalty/account/barcode?code=${encodeURIComponent(card.barcode)}`}
                alt={`Штрихкод карты ${card.barcode}`}
                className="aspect-[3/1] w-full max-w-[360px] object-fill"
              />
              <span className="type-label tracking-[0.2em]">{card.barcode}</span>
              <span className="type-caption text-text-2">Покажите на кассе, чтобы начислить или списать баллы</span>
            </div>

            {(cabinet.wallets.apple || cabinet.wallets.google) && (
              <div className="flex flex-col gap-2 sm:flex-row">
                {cabinet.wallets.apple && (
                  <a href={`/api/loyalty/account/wallet/apple?card=${card.id}`} className={`${buttonClass("outline", "M")} flex-1`}>
                    Добавить в Apple Wallet
                  </a>
                )}
                {cabinet.wallets.google && (
                  <a href={`/api/loyalty/account/wallet/google?card=${card.id}`} className={`${buttonClass("outline", "M")} flex-1`}>
                    Добавить в Google Кошелёк
                  </a>
                )}
              </div>
            )}
          </>
        ) : (
          <p className="type-body-l text-text-2">Карта пока не выпущена.</p>
        )}
      </div>

      <div className="flex flex-col gap-10 lg:col-span-7">
        {cabinet.nextExpiry && (
          <p className="type-body border-l-2 border-brand pl-4">
            {points(cabinet.nextExpiry.amount)} сгорят {day.format(cabinet.nextExpiry.date)}
          </p>
        )}

        <section className="flex flex-col gap-4">
          <h2 className="type-h3">Выгода за год</h2>
          <div className="grid gap-2 sm:grid-cols-3">
            <Stat label="Покупки" value={`${number.format(cabinet.year.spent)} ₽`} />
            <Stat label="Начислено" value={points(cabinet.year.earned)} />
            <Stat label="Потрачено" value={points(cabinet.year.used)} />
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="type-h3">История</h2>
          {cabinet.history.length ? (
            <ul className="flex flex-col divide-y divide-line border-y border-line">
              {cabinet.history.map((row) => (
                <li key={row.id} className="flex items-baseline justify-between gap-4 py-3">
                  <span className="flex min-w-0 flex-col gap-1">
                    <span className="type-body truncate">{row.title}</span>
                    <span className="type-caption text-text-2">
                      {short.format(row.date)}
                      {row.sum !== undefined ? ` · ${number.format(row.sum)} ₽` : ""}
                    </span>
                  </span>
                  {row.points !== 0 && (
                    <span className={`type-body shrink-0 ${row.points > 0 ? "text-brand" : ""}`}>
                      {row.points > 0 ? "+" : "−"}
                      {points(Math.abs(row.points))}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="type-body text-text-2">Покупок пока нет. Покажите карту на кассе — баллы начислятся сами.</p>
          )}
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="type-h3">Профиль</h2>
          <Facts
            items={[
              { label: "Имя", value: cabinet.name || "—" },
              { label: "Телефон", value: cabinet.phone || "—" },
              ...(cabinet.email ? [{ label: "E-mail", value: cabinet.email }] : []),
            ]}
          />
          <LoyaltyLogout />
        </section>
      </div>
    </div>
  );
}
