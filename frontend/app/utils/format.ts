export function formatEuroDE(value: number): string {
    return new Intl.NumberFormat("de-DE", {
        style: "currency",
        currency: "EUR",
    }).format(value);
}

// Sorgt dafür, dass die Preise im Shop korrekt formatiert werden, z.B. 1.234,56 €.
