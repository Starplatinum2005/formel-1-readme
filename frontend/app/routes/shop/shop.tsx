import { useEffect, useState } from "react";
import "./shop.css";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);

  // 1. Daten beim Laden der Seite vom Server holen
  useEffect(() => {
    fetch("http://localhost:3000/products")
      .then((response) => {
        if (!response.ok) throw new Error("Fehler beim Laden der Daten");
        return response.json();
      })
      .then((data) => setProducts(data))
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div className="shop-container">
      <h1>Apex League Shop</h1>
      
      {error && <p className="error-msg">{error}</p>}

      <div className="product-grid">
        {products.length === 0 && !error && <p>Keine Produkte gefunden.</p>}
        
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <div className="price-tag">{product.price} €</div>
            <button className="buy-button">In den Warenkorb</button>
          </div>
        ))}
      </div>
    </div>
  );
}