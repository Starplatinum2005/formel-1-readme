export function formatEuroDE(value: number): string {
    return new Intl.NumberFormat("de-DE", {
        style: "currency",
        currency: "EUR",
    }).format(value);
}

// Sorgt dafür, dass die Preise im Shop korrekt formatiert werden, z.B. 1.234,56 €.
export function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("de-DE", { year: "numeric", month: "short", day: "2-digit" });
}

export function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}