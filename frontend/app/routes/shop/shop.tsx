import { useEffect, useState } from "react";
// Wir entfernen useNavigate, um den Hook-Error zu vermeiden, 
// falls die Routing-Umgebung noch nicht bereit ist.
import { formatEuroDE } from "~/utils/format";
import "./shop.css";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
}

const CATEGORIES = ["Fahrzeuge", "Ausrüstung", "Merchandise", "Hardware"];

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

useEffect(() => {
  // localStorage gibt es nur im Browser
  if (typeof window === "undefined") return;

  const token = localStorage.getItem("sessionToken");
  if (!token) {
    setIsAdmin(false);
    return;
  }

  fetch("http://localhost:3000/auth/me", {
    headers: { "x-session-token": token },
  })
    .then((res) => (res.ok ? res.json() : null))
    .then((data) => {
      setIsAdmin(data?.role === "admin");
    })
    .catch(() => setIsAdmin(false));
}, []);


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
      <div className="shop-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Apex League Shop</h1>

        {/* Wir nutzen window.location für die Navigation, das ist robuster gegen Hook-Fehler */}
        {isAdmin && (
          <button
            className="admin-add-btn"
            onClick={() => window.location.href = '/admin/add-product'}
            style={{ backgroundColor: '#e10600', color: 'white', border: 'none', padding: '10px 20px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            ➕ Produkt hinzufügen
          </button>
        )}
      </div>

      {error && <p className="error-msg">{error}</p>}

      {CATEGORIES.map((cat) => {
        const categoryProducts = products.filter(p => p.category === cat);
        if (categoryProducts.length === 0) return null;

        return (
          <div key={cat} className="category-section">
            <h2 className="category-title">{cat}</h2>
            <div className="product-grid">
              {categoryProducts.map((product) => (
                <div key={product.id} className="product-card">
                  {product.image && (
                    <div className="product-image-container">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="product-image"
                        onError={(e) => (e.currentTarget.style.display = 'none')}
                      />
                    </div>
                  )}
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <div className="price-tag">{formatEuroDE(product.price)}</div>
                  <button className="buy-button">In den Warenkorb</button>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {products.length === 0 && !error && (
        <p className="no-products">Aktuell sind keine Produkte verfügbar.</p>
      )}
    </div>
  );
}