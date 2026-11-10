/** Quote a cell; a leading = + - @ would be run as a formula by spreadsheets. */
function cell(v: string): string {
  const safe = /^[=+\-@\t\r]/.test(v) ? `'${v}` : v;
  return `"${safe.replace(/"/g, '""')}"`;
}

export function registrationsCsv(
  rows: { email: string; createdAt: Date; attendedAt: Date | null }[],
): string {
  const lines = rows.map((r) =>
    [
      cell(r.email),
      cell(r.createdAt.toISOString()),
      cell(r.attendedAt ? r.attendedAt.toISOString() : ""),
    ].join(","),
  );
  return "﻿" + ["email,created_at,attended_at", ...lines].join("\r\n") + "\r\n";
}
