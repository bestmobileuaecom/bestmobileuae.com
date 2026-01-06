import { Suspense } from "react";
import PhonesClient from "./PhonesClient";
import PublicLayout from "@/components/common/PublicLayout";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bestmobileuae.com";

export const metadata = {
  title: "Phones in UAE - Compare Prices & Expert Scores",
  description:
    "Browse phones available in the UAE. Filter by brand, budget, and what you care about (camera, battery, gaming). Compare prices and expert scores.",
  alternates: {
    canonical: `${siteUrl}/phones`,
  },
  openGraph: {
    title: "Phones in UAE - Compare Prices & Expert Scores",
    description:
      "Browse phones available in the UAE. Filter by brand, budget, and what you care about (camera, battery, gaming).",
    url: `${siteUrl}/phones`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Phones in UAE - Compare Prices & Expert Scores",
    description:
      "Browse phones available in the UAE. Filter by brand, budget, and what you care about (camera, battery, gaming).",
  },
};

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="animate-pulse text-muted-foreground">Loading phones...</div>
    </div>
  );
}

export default function PhonesPage() {
  return (
    <PublicLayout>
      <Suspense fallback={<LoadingFallback />}>
        <PhonesClient />
      </Suspense>
    </PublicLayout>
  );
}
