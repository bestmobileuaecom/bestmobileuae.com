import Hero from "@/components/features/home/Hero";
import BudgetFinderCard from "@/components/features/home/BudgetFinderCard";
import LatestPopularPhones from "@/components/features/home/LatestPopularPhones";
import ComparisonCTA from "@/components/features/home/ComparisonCTA";
import BuyingGuides from "@/components/features/home/BuyingGuides";
import TrustTransparency from "@/components/features/home/TrustTransparency";


const popularPhones = [
  { id: 1, name: "iPhone 15 Pro Max", expert_score: 8.3, main_image: "/mobile1.jpg" },
  { id: 2, name: "Samsung Galaxy S24 Ultra", expert_score: 8.5, main_image: "/mobile1.jpg" },
  { id: 3, name: "Google Pixel 8 Pro", expert_score: 8.0, main_image: "/mobile1.jpg" },
  { id: 4, name: "Google Pixel 9 Pro", expert_score: 7.0, main_image: "/mobile1.jpg" },
];

const latestPhones = [
  { id: 5, name: "OnePlus 12", expert_score: 7.8, main_image: "/mobile1.jpg" },
  { id: 6, name: "Xiaomi 14 Pro", expert_score: 8.1, main_image: "/mobile1.jpg" },
  { id: 7, name: "Sony Xperia 1 V", expert_score: 7.5, main_image: "/mobile1.jpg" },
  { id: 8, name: "Sony Xperia 2 V", expert_score: 7.2, main_image: "/mobile1.jpg" },
];

export default function Home() {
  return (
     <>
       {/* 1️⃣ Hero Section - 2-COLUMN with phones + budget filter */}
    <Hero trendingPhones={popularPhones} />
    {/* 2️⃣ Budget + Quick Finder - Combined card section */}
    <BudgetFinderCard />
    {/* 3️⃣ Latest & Popular Phones */}
      <LatestPopularPhones
          latestPhones={latestPhones}
          popularPhones={popularPhones}
        />
         {/* 4️⃣ Comparison CTA */}
        <ComparisonCTA />
                {/* 6️⃣ Buying Guides */}
        <BuyingGuides />

        {/* 7️⃣ Trust & Transparency */}
        <TrustTransparency />
    </>
  );
}
