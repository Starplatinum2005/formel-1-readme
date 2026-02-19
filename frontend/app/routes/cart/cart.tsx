import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  clearCart,
  loadCart,
  removeFromCart,
  setQty,
  type CartItem,
} from "~/utils/cart";
import "./cart.css";

type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  image?: string;
  stock: number;
};

export default function CartPage() {
  const navigate = useNavigate();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setCart(loadCart());

    fetch("http://localhost:3000/products")
      .then((r) => {
        if (!r.ok) throw new Error("Produkte konnten nicht geladen werden");
        return r.json();
      })
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const rows = useMemo(() => {
    return cart
      .map((c) => {
        const p = products.find((x) => x.id === c.productId);
        if (!p) return null;
        return { item: c, product: p };
      })
      .filter(Boolean) as { item: CartItem; product: Product }[];
  }, [cart, products]);

  const total = useMemo(() => {
    return rows.reduce((sum, r) => sum + r.product.price * r.item.quantity, 0);
  }, [rows]);

  const itemCount = useMemo(() => {
    return cart.reduce((sum, it) => sum + (it.quantity || 0), 0);
  }, [cart]);

  async function checkout() {
    setError(null);
    setInfo(null);

    if (cart.length === 0) {
      setError("Warenkorb ist leer.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/orders/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cart }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data?.message || `Checkout fehlgeschlagen (${res.status})`);
        return;
      }

      clearCart();
      setCart([]);
      setInfo("Kauf erfolgreich! Bestand wurde aktualisiert.");

      setTimeout(() => navigate("/shop"), 1200);
    } catch {
      setError("Server nicht erreichbar.");
    }
  }

  if (loading) {
    return (
      <div className="cart-page">
        <div className="cart-container">
          <p className="cart-muted">Lade Warenkorb…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        <header className="cart-header">
          <div>
            <h1 className="cart-title">Warenkorb</h1>
            <p className="cart-subtitle">
              {itemCount > 0
                ? `${itemCount} Artikel im Warenkorb`
                : "Dein Warenkorb ist aktuell leer"}
            </p>
          </div>

          <Link to="/shop" className="cart-back">
            ← Zum Shop
          </Link>
        </header>

        {error && <div className="cart-alert cart-alert--error">⚠️ {error}</div>}
        {info && <div className="cart-alert cart-alert--success">✅ {info}</div>}

        {rows.length === 0 ? (
          <div className="cart-empty">
            <div className="cart-empty-icon">🛒</div>
            <div>
              <h2>Warenkorb leer</h2>
              <p>Füge Produkte im Shop hinzu, um sie hier zu sehen.</p>
              <Link className="cart-primary-link" to="/shop">
                Jetzt shoppen
              </Link>
            </div>
          </div>
        ) : (
          <>
            <section className="cart-grid">
              {rows.map(({ item, product }) => {
                const max = product.stock ?? 0;
                const safeQty = Math.min(item.quantity, Math.max(1, max));
                const tooMuch = item.quantity > max;

                return (
                  <article key={product.id} className="cart-card">
                    <div className="cart-thumb">
                      <div className="cart-thumb-fallback">🖼️</div>
                      {product.image && (
                        <img
                          className="cart-thumb-img"
                          src={product.image}
                          alt={product.name}
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).style.display =
                              "none";
                          }}
                        />
                      )}
                    </div>

                    <div className="cart-card-body">
                      <div className="cart-card-top">
                        <h3 className="cart-card-title">{product.name}</h3>
                        <span className="cart-badge">{product.category}</span>
                      </div>

                      <div className="cart-meta">
                        <div className="cart-price">
                          <span>Einzelpreis</span>
                          <b>{product.price.toFixed(2)} €</b>
                        </div>

                        <div className="cart-stock">
                          <span>Bestand</span>
                          <b className={max <= 0 ? "is-out" : ""}>{max}</b>
                        </div>
                      </div>

                      {tooMuch && (
                        <div className="cart-warning">
                          Menge ist höher als verfügbar. Bitte reduzieren.
                        </div>
                      )}

                      <div className="cart-actions">
                        <div className="cart-qty">
                          <button
                            className="cart-qty-btn"
                            onClick={() => {
                              const next = setQty(
                                product.id,
                                safeQty - 1,
                                Math.max(1, max)
                              );
                              setCart([...next]);
                            }}
                            disabled={safeQty <= 1}
                            aria-label="Menge verringern"
                          >
                            –
                          </button>

                          <input
                            className="cart-qty-input"
                            type="number"
                            min={1}
                            max={Math.max(1, max)}
                            value={safeQty}
                            onChange={(e) => {
                              const q = Number(e.target.value);
                              const next = setQty(
                                product.id,
                                q,
                                Math.max(1, max)
                              );
                              setCart([...next]);
                            }}
                            aria-label="Menge"
                          />

                          <button
                            className="cart-qty-btn"
                            onClick={() => {
                              const next = setQty(
                                product.id,
                                safeQty + 1,
                                Math.max(1, max)
                              );
                              setCart([...next]);
                            }}
                            disabled={max <= 0 || safeQty >= max}
                            aria-label="Menge erhöhen"
                          >
                            +
                          </button>
                        </div>

                        <button
                          className="cart-remove"
                          onClick={() => {
                            const next = removeFromCart(product.id);
                            setCart([...next]);
                          }}
                        >
                          Entfernen
                        </button>
                      </div>

                      <div className="cart-line-total">
                        <span>Zwischensumme</span>
                        <b>{(product.price * safeQty).toFixed(2)} €</b>
                      </div>
                    </div>
                  </article>
                );
              })}
            </section>

            <aside className="cart-summary">
              <div className="cart-summary-row">
                <span>Artikel</span>
                <b>{itemCount}</b>
              </div>

              <div className="cart-summary-row">
                <span>Gesamt</span>
                <b className="cart-total">{total.toFixed(2)} €</b>
              </div>

              <div className="cart-summary-actions">
                <button
                  className="cart-btn cart-btn--ghost"
                  onClick={() => {
                    clearCart();
                    setCart([]);
                  }}
                >
                  Warenkorb leeren
                </button>

                <button className="cart-btn cart-btn--primary" onClick={checkout}>
                  Jetzt kaufen
                </button>
              </div>

              <p className="cart-summary-note">
                Hinweis: Der Server prüft den Lagerbestand beim Checkout.
              </p>
            </aside>
          </>
        )}
      </div>
    </div>
  );
}
