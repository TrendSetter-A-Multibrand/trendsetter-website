/** Quote a cell; a leading = + - @ would be run as a formula by spreadsheets. */
function cell(v: string): string {
  const safe = /^[=+\-@\t\r]/.test(v) ? `'${v}` : v;
  return `"${safe.replace(/"/g, '""')}"`;
}

export function registrationsCsv(
  rows: {
    name: string;
    phone: string;
    email: string;
    createdAt: Date;
    attendedAt: Date | null;
  }[],
): string {
  const lines = rows.map((r) =>
    [
      cell(r.name),
      // Without the plus: a spreadsheet would take "+7…" for a formula, and the guard below would then put a stray quote in front of it
      cell(r.phone.replace(/^\+/, "")),
      cell(r.email),
      cell(r.createdAt.toISOString()),
      cell(r.attendedAt ? r.attendedAt.toISOString() : ""),
    ].join(","),
  );
  return "﻿" + ["full_name,phone,email,created_at,attended_at", ...lines].join("\r\n") + "\r\n";
}
