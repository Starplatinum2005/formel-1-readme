import { clamp } from "~/utils/format";
import "./stars.css"

export function Stars({ value }: { value: number }) {
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

