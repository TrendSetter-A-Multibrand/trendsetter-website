const number = new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 2 });

/** "1 балл", "3 балла", "15 баллов" */
export function points(n: number) {
  const abs = Math.abs(Math.trunc(n));
  const tail = abs % 100 >= 11 && abs % 100 <= 14 ? "баллов" : ["баллов", "балл", "балла", "балла", "балла"][abs % 10] ?? "баллов";
  return `${number.format(n)} ${tail}`;
}

/** The service's card state in words; a state it does not list is shown as it came. */
export function cardStatus(state: string): string {
  const known: Record<string, string> = {
    active: "Активна",
    inactive: "Не активна",
    blocked: "Заблокирована",
    expired: "Срок действия истёк",
    issued: "Выпущена",
    new: "Новая",
  };
  return known[state.toLowerCase()] ?? state;
}
