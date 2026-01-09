import { useEffect, useMemo, useState } from "react";
import "./startseite.css";

type NewsItem = {
  id: string;
  title: string;
  excerpt: string;
  category: "Platform" | "Tracks" | "Community" | "Shop";
  publishedAt: string; // ISO
  readingTimeMin: number;
};

type TrackCard = {
  id: string;
  name: string;
  country: string;
  difficulty: "Easy" | "Medium" | "Hard";
  avgRating: number; // 0..5
  totalReviews: number;
};

type ProductCard = {
  id: string;
  name: string;
  priceEUR: number;
  badge?: "New" | "Bestseller" | "Limited";
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("de-DE", { year: "numeric", month: "short", day: "2-digit" });
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function Stars({ value }: { value: number }) {
  const v = clamp(value, 0, 5);
  const full = Math.floor(v);
  const half = v - full >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;

  const star = (fill: "full" | "half" | "empty", i: number) => {
    const title = fill === "full" ? "voll" : fill === "half" ? "halb" : "leer";
    return (
      <span key={`${fill}-${i}`} aria-label={title} className={`star star--${fill}`}>
        ★
      </span>
    );
  };

  return (
    <span className="stars" aria-label={`${v.toFixed(1)} von 5 Sternen`}>
      {Array.from({ length: full }).map((_, i) => star("full", i))}
      {half ? star("half", 0) : null}
      {Array.from({ length: empty }).map((_, i) => star("empty", i))}
      <span className="stars__value">{v.toFixed(1)}</span>
    </span>
  );
}

export default function HomePage() {
  // Demo-Daten: später durch API ersetzen
  const mockNews: NewsItem[] = useMemo(
    () => [
      {
        id: "n1",
        title: "Apex Tracks geht live: Profile, gefahrene Strecken & Bewertungen",
        excerpt:
          "Erstelle dein Profil, markiere Strecken als gefahren und teile deine Erfahrungen – inklusive Ratings & kurzen Reviews.",
        category: "Platform",
        publishedAt: "2026-01-05T08:00:00.000Z",
        readingTimeMin: 3,
      },
      {
        id: "n2",
        title: "Neue Feature-Highlights: Streckenfilter, Länder & Difficulty",
        excerpt: "Finde schnell passende Tracks: Filter nach Land, Schwierigkeitsgrad und Community-Rating.",
        category: "Tracks",
        publishedAt: "2026-01-03T10:30:00.000Z",
        readingTimeMin: 2,
      },
      {
        id: "n3",
        title: "Community Guidelines: Reviews, Moderation und Fairness",
        excerpt:
          "Damit Bewertungen nützlich bleiben: klare Regeln, Report-Funktion und Moderation für saubere Inhalte.",
        category: "Community",
        publishedAt: "2026-01-01T13:15:00.000Z",
        readingTimeMin: 4,
      },
      {
        id: "n4",
        title: "Shop Preview: Limitiertes Apex Tracks Starter Bundle",
        excerpt:
          "Ein kleiner, sauberer Shop-Flow mit Orders & Status – perfekt für euer MVP und die Bewertung.",
        category: "Shop",
        publishedAt: "2025-12-28T16:00:00.000Z",
        readingTimeMin: 2,
      },
    ],
    []
  );

  const mockFeaturedTracks: TrackCard[] = useMemo(
    () => [
      { id: "t1", name: "Redstone Raceway", country: "DE", difficulty: "Medium", avgRating: 4.4, totalReviews: 128 },
      { id: "t2", name: "Coastal Sprint Circuit", country: "IT", difficulty: "Hard", avgRating: 4.7, totalReviews: 92 },
      { id: "t3", name: "Nord Crest Park", country: "GB", difficulty: "Easy", avgRating: 4.1, totalReviews: 210 },
    ],
    []
  );

  const mockFeaturedProducts: ProductCard[] = useMemo(
    () => [
      { id: "p1", name: "Apex Tracks Cap (Black/Red)", priceEUR: 24.9, badge: "Bestseller" },
      { id: "p2", name: "Gridline Hoodie (Black)", priceEUR: 59.0, badge: "New" },
      { id: "p3", name: "Track Sticker Pack", priceEUR: 6.5 },
    ],
    []
  );

  const [news, setNews] = useState<NewsItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Simuliertes Laden – später: fetch("/api/news")
  useEffect(() => {
    let alive = true;
    setError(null);
    setNews(null);

    const timer = window.setTimeout(() => {
      if (!alive) return;
      setNews(mockNews);
    }, 450);

    return () => {
      alive = false;
      window.clearTimeout(timer);
    };
  }, [mockNews]);

  return (
    <div className="page">
      <a className="skip" href="#main">
        Zum Inhalt springen
      </a>

      <main id="main" className="main">
        {/* HERO */}
        <section className="hero">
          <div className="container hero__grid">
            <div className="hero__copy">
              <p className="kicker">Motorsport-Feeling, aber als echtes Produkt</p>
              <h1 className="h1">
                Dokumentiere deine gefahrenen Strecken, bewerte sie – und entdecke neue Highlights.
              </h1>
              <p className="lead">
                Apex Tracks kombiniert <strong>Streckenprofile</strong>, <strong>Community-Reviews</strong> und einen
                kleinen, sauber umgesetzten <strong>Shop-Flow</strong> (Orders & Status).
              </p>

              <div className="hero__actions">
                <a className="btn btn--primary" href="/auth/register">
                  Jetzt starten
                </a>
                <a className="btn btn--secondary" href="/tracks">
                  Tracks entdecken
                </a>
              </div>

              <div className="stats" role="list" aria-label="Plattform Kennzahlen (Demo)">
                <div className="stat" role="listitem">
                  <div className="stat__num">3.2k</div>
                  <div className="stat__label">Community Reviews</div>
                </div>
                <div className="stat" role="listitem">
                  <div className="stat__num">148</div>
                  <div className="stat__label">Track Profiles</div>
                </div>
                <div className="stat" role="listitem">
                  <div className="stat__num">24h</div>
                  <div className="stat__label">Moderation SLA</div>
                </div>
              </div>
            </div>

            <div className="hero__panel" aria-label="Featured Bereich">
              <div className="panel">
                <div className="panel__top">
                  <div className="panel__title">Heute im Fokus</div>
                  <a className="panel__link" href="/tracks/featured">
                    Alle ansehen →
                  </a>
                </div>

                <div className="tracklist">
                  {mockFeaturedTracks.map((t) => (
                    <article key={t.id} className="trackcard">
                      <div className="trackcard__left">
                        <div className="trackcard__name">{t.name}</div>
                        <div className="trackcard__meta">
                          <span className="pill">{t.country}</span>
                          <span className={`pill pill--${t.difficulty.toLowerCase()}`}>{t.difficulty}</span>
                          <span className="muted">{t.totalReviews} Reviews</span>
                        </div>
                      </div>
                      <div className="trackcard__right">
                        <Stars value={t.avgRating} />
                        <a className="trackcard__open" href={`/tracks/${t.id}`} aria-label={`Track öffnen: ${t.name}`}>
                          Öffnen →
                        </a>
                      </div>
                    </article>
                  ))}
                </div>

                <div className="panel__footer">
                  <a className="btn btn--tiny" href="/profile">
                    Strecken als gefahren markieren
                  </a>
                  <a className="btn btn--tiny btn--ghost" href="/reviews/new">
                    Review schreiben
                  </a>
                </div>
              </div>

              <div className="accent" aria-hidden="true" />
            </div>
          </div>
        </section>

        {/* NEWS */}
        <section className="section">
          <div className="container">
            <div className="section__head">
              <h2 className="h2">Latest News</h2>
              <div className="section__actions">
                <a className="link" href="/news">
                  Alle News →
                </a>
              </div>
            </div>

            {error ? (
              <div className="alert alert--error" role="alert">
                <strong>Fehler:</strong> {error}
              </div>
            ) : null}

            {!news ? (
              <div className="grid grid--news" aria-busy="true" aria-label="News werden geladen">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="skeleton">
                    <div className="skeleton__line skeleton__line--kicker" />
                    <div className="skeleton__line skeleton__line--title" />
                    <div className="skeleton__line" />
                    <div className="skeleton__line" />
                    <div className="skeleton__line skeleton__line--meta" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid--news">
                {news.map((n) => (
                  <article key={n.id} className="card">
                    <div className="card__kicker">
                      <span className={`badge badge--${n.category.toLowerCase()}`}>{n.category}</span>
                      <span className="muted">
                        {formatDate(n.publishedAt)} · {n.readingTimeMin} min
                      </span>
                    </div>
                    <h3 className="h3">{n.title}</h3>
                    <p className="card__text">{n.excerpt}</p>
                    <div className="card__footer">
                      <a className="link" href={`/news/${n.id}`}>
                        Weiterlesen →
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* SHOP TEASER */}
        <section className="section section--dark">
          <div className="container">
            <div className="section__head">
              <h2 className="h2">Shop Preview</h2>
              <div className="section__actions">
                <a className="link link--light" href="/shop">
                  Zum Shop →
                </a>
              </div>
            </div>

            <div className="grid grid--shop">
              {mockFeaturedProducts.map((p) => (
                <article key={p.id} className="card card--dark">
                  <div className="product__top">
                    <div className="product__name">{p.name}</div>
                    {p.badge ? <span className="badge badge--hot">{p.badge}</span> : null}
                  </div>
                  <div className="product__price">{p.priceEUR.toFixed(2)} €</div>
                  <div className="product__actions">
                    <a className="btn btn--primary" href={`/shop/products/${p.id}`}>
                      Details
                    </a>
                    <a className="btn btn--secondary" href={`/shop/cart?add=${encodeURIComponent(p.id)}`}>
                      In den Warenkorb
                    </a>
                  </div>
                  <p className="muted small">
                    (MVP-Hinweis) Orders mit Status: <code>CREATED → PAID → SHIPPED</code>
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section">
          <div className="container cta">
            <div>
              <h2 className="h2">Bereit für dein Apex Tracks Profil?</h2>
              <p className="lead">
                Markiere Strecken als gefahren, schreibe Reviews und sammle dein persönliches Track-Log.
              </p>
            </div>
            <div className="cta__actions">
              <a className="btn btn--primary" href="/auth/register">
                Kostenlos registrieren
              </a>
              <a className="btn btn--secondary" href="/tracks">
                Tracks durchsuchen
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer__inner">
          <div className="muted small">© {new Date().getFullYear()} Apex Tracks — Unofficial motorsport-themed product.</div>
          <div className="footer__links">
            <a className="link" href="/imprint">
              Impressum
            </a>
            <a className="link" href="/privacy">
              Datenschutz
            </a>
            <a className="link" href="/about">
              About
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
