import Link from "next/link";

export const featuredBrands = [
  "Apple",
  "Samsung",
  "Xiaomi",
  "OPPO",
  "Vivo",
  "Realme",
  "POCO",
  "OnePlus",
  "Google",
  "Motorola",
];

export default function FooterBrands() {
  const brands = featuredBrands;
  const topBrands = brands.slice(0, 4);

  return (
    <div>
      <h3 className="font-semibold mb-4 text-foreground">Top Brands</h3>
      <ul className="space-y-2 text-sm text-muted-foreground">
        {topBrands.map((brand) => (
          <li key={brand}>
            <Link
              href={`/phones?brand=${brand}`}
              className="hover:text-foreground transition-colors"
            >
              {brand}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
