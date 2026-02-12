import fs from "node:fs/promises";
import path from "node:path";
import type { ProductCard } from "~/types";

export async function loader() {
  
  const filePath = path.join(process.cwd(), "..", "server", "products.json");
  const fileContent = await fs.readFile(filePath, "utf-8");
  const rawData = JSON.parse(fileContent); 
  const products = rawData.filter((item: any) => item.price !== undefined); 
  const featuredProducts: ProductCard[] = products
    .slice(0, 3) 
    .map((p: any) => ({
      id: p.id,
      name: p.name,
      
      priceEUR: p.price, 
      
      badge: p.category === "Fahrzeuge" ? "Hot" : undefined
    }));
  return { featuredProducts };
}