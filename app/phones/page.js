import Link from "next/link";
import { demoPhone } from "@/lib/demo-phone-data";

export default function PhonesList() {
  const phones = demoPhone;
  return (
    <div className="grid gap-4">
      {phones.map((p) => (
        <Link
          key={p.id}
          href={`/phones/${p.slug}`}
          className="rounded-lg border p-4 hover:bg-muted"
        >
          <div className="font-semibold">{p.name}</div>
          <div className="text-sm text-muted-foreground">{p.priceRange}</div>
        </Link>
      ))}
    </div>
  );
}
