import Link from "next/link";

export default function Home() {
  return (
    <Link href="/phones" className="text-blue-500 underline">
      View Phones List
    </Link>
  );
}
