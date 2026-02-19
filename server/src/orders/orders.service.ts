import { ConflictException, Injectable, BadRequestException, NotFoundException } from "@nestjs/common";
import * as fs from "fs";

type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  image?: string;
  stock: number;
};

@Injectable()
export class OrdersService {
  private readonly dbPath = "./products.json";

  private readProducts(): Product[] {
    if (!fs.existsSync(this.dbPath)) fs.writeFileSync(this.dbPath, JSON.stringify([]));
    const content = fs.readFileSync(this.dbPath, "utf-8");
    try {
      return JSON.parse(content);
    } catch {
      return [];
    }
  }

  private writeProducts(products: Product[]) {
    fs.writeFileSync(this.dbPath, JSON.stringify(products, null, 2));
  }

  checkout(items: { productId: string; quantity: number }[]) {
    if (!Array.isArray(items) || items.length === 0) {
      throw new BadRequestException("Warenkorb ist leer");
    }

    // Eingaben prüfen
    for (const it of items) {
      if (!it?.productId || !Number.isFinite(Number(it.quantity)) || Number(it.quantity) <= 0) {
        throw new BadRequestException("Ungültige Warenkorb-Daten");
      }
    }

    const products = this.readProducts();

    // 1) Prüfen, ob alles verfügbar ist
    for (const it of items) {
      const p = products.find((x) => x.id === it.productId);
      if (!p) throw new NotFoundException(`Produkt nicht gefunden: ${it.productId}`);

      const qty = Number(it.quantity);
      const stock = Number(p.stock ?? 0);

      if (qty > stock) {
        throw new ConflictException(
          `Nicht genug Bestand für "${p.name}". Verfügbar: ${stock}, angefragt: ${qty}`
        );
      }
    }

    // 2) Bestand reduzieren
    for (const it of items) {
      const p = products.find((x) => x.id === it.productId)!;
      p.stock = Number(p.stock ?? 0) - Number(it.quantity);
    }

    this.writeProducts(products);

    // Optional: Gesamtpreis berechnen
    const total = items.reduce((sum, it) => {
      const p = products.find((x) => x.id === it.productId)!;
      return sum + Number(p.price) * Number(it.quantity);
    }, 0);

    return { ok: true, total };
  }
}
