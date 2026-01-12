import "./footer.css"
import "./../routes/startseite/startseite.css"

export default function Footer() {
    return (
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
    )
}