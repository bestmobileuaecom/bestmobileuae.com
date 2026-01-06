import Hero from "@/components/features/home/Hero";
import BudgetFinderCard from "@/components/features/home/BudgetFinderCard";
import LatestPopularPhones from "@/components/features/home/LatestPopularPhones";
import ComparisonCTA from "@/components/features/home/ComparisonCTA";
import BuyingGuides from "@/components/features/home/BuyingGuides";
import TrustTransparency from "@/components/features/home/TrustTransparency";
import { getPublishedPhones } from "@/lib/data/phones";
import { getPublishedArticles } from "@/lib/data/articles";
import PublicLayout from "@/components/common/PublicLayout";

export default async function Home() {
  // Fetch phones from Supabase with different sorting for each tab
  let allPhones = [];
  
  try {
    // Fetch all phones once, then sort for each category
    allPhones = await getPublishedPhones({ sortBy: "created_at" });
  } catch (e) {
    console.log("Error fetching phones:", e);
  }

  // Transform phone data for frontend
  const transformPhone = (p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    expert_score: p.overallScore?.rating || 0,
    main_image: p.image || "/mobile1.jpg",
    value_score: p.scores?.value || 0,
  });

  // Latest: Sorted by creation date (newest first) - already sorted
  const latestPhones = allPhones.slice(0, 8).map(transformPhone);

  // Popular: Sorted by overall score (highest first)
  const popularPhones = [...allPhones]
    .sort((a, b) => (b.overallScore?.rating || 0) - (a.overallScore?.rating || 0))
    .slice(0, 8)
    .map(transformPhone);

  // Top Rated: Same as popular (highest overall score)
  const topRatedPhones = popularPhones;

  // Best Value: Sorted by value score (highest first)
  const bestValuePhones = [...allPhones]
    .sort((a, b) => (b.scores?.value || 0) - (a.scores?.value || 0))
    .slice(0, 8)
    .map(transformPhone);

  // Fetch articles from Supabase
  let articles = [];
  try {
    articles = await getPublishedArticles({ limit: 4 });
  } catch (e) {
    console.log("Error fetching articles:", e);
  }

  // Generate popular comparisons from phones data
  const popularComparisons = [];
  if (popularPhones.length >= 2) {
    // Create up to 3 comparisons from available phones
    for (let i = 0; i < Math.min(3, Math.floor(popularPhones.length / 2)); i++) {
      const phone1 = popularPhones[i * 2];
      const phone2 = popularPhones[i * 2 + 1];
      if (phone1 && phone2) {
        popularComparisons.push({
          phone1: phone1.name,
          phone2: phone2.name,
          slug: `${phone1.slug},${phone2.slug}`,
        });
      }
    }
  }

  return (
    <PublicLayout>
      {/* 1️⃣ Hero Section - 2-COLUMN with phones + budget filter */}
      <Hero trendingPhones={popularPhones.slice(0, 4)} />
      {/* 2️⃣ Budget + Quick Finder - Combined card section */}
      <BudgetFinderCard />
      {/* 3️⃣ Latest & Popular Phones */}
      <LatestPopularPhones
        latestPhones={latestPhones}
        popularPhones={popularPhones}
        topRatedPhones={topRatedPhones}
        bestValuePhones={bestValuePhones}
      />
      {/* 4️⃣ Comparison CTA */}
      <ComparisonCTA comparisons={popularComparisons} />
      {/* 6️⃣ Buying Guides */}
      <BuyingGuides articles={articles} />
      {/* 7️⃣ Trust & Transparency */}
      <TrustTransparency />
    </PublicLayout>
  );
}
