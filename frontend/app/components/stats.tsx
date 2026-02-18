import './stats.css';

export type Statst = {
  value: string;
  label: string;
};

export default function Stats({ items }: { items: Statst[] }) {
  return (
    <div className="stats" role="list" aria-label="Plattform Kennzahlen">
      {items.map((item, index) => (
        <div key={index} className="stat" role="listitem">
          <div className="stat__num">{item.value}</div>
          <div className="stat__label">{item.label}</div>
        </div>
      ))}
    </div>
  );
}