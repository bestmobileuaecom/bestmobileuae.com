import { BookOpen, ArrowRight, Clock } from "lucide-react";
import Link from "next/link";

// Default blog articles for SEO
const defaultArticles = [
  {
    id: 1,
    title: "Best Phones Under 1,000 AED in 2025",
    excerpt: "Top budget picks with great value",
    slug: "best-phones-under-1000-aed",
    category: "Buying Guide",
    readTime: "5 min",
  },
  {
    id: 2,
    title: "Best Camera Phones Under 2,000 AED",
    excerpt: "Perfect for photography enthusiasts",
    slug: "best-camera-phones-under-2000",
    category: "Buying Guide",
    readTime: "7 min",
  },
  {
    id: 3,
    title: "Top Gaming Phones in 2025",
    excerpt: "Ultimate performance for mobile gamers",
    slug: "top-gaming-phones-2025",
    category: "Buying Guide",
    readTime: "6 min",
  },
  {
    id: 4,
    title: "Best Battery Life Phones",
    excerpt: "Phones that last all day and more",
    slug: "best-battery-life-phones",
    category: "Buying Guide",
    readTime: "4 min",
  },
];

export default function BuyingGuides({ articles = [] }) {
  const displayArticles =
    articles.length > 0 ? articles.slice(0, 4) : defaultArticles;

  return (
    <section className="py-4 md:py-6">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Card Container */}
          <div className="bg-card border border-border/60 rounded-2xl shadow-sm overflow-hidden">
            {/* Gradient accent */}
            <div className="h-1 bg-gradient-to-r from-primary/60 via-primary to-primary/60" />
            
            <div className="p-5 md:p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 flex items-center justify-center bg-primary/10 rounded-xl">
                    <BookOpen className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-foreground">Buying Guides</h2>
                    <p className="text-sm text-muted-foreground">Expert insights to help you choose</p>
                  </div>
                </div>
                <Link
                  href="/blogs"
                  className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  All guides
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Articles Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {displayArticles.map((article, index) => (
                  <Link
                    key={article.id}
                    href={`/blogs/${article.slug}`}
                    className="group flex items-center gap-4 p-4 bg-muted/30 rounded-xl border border-border/40 hover:border-primary/30 hover:bg-muted/50 hover:shadow-md transition-all duration-200"
                  >
                    {/* Number Badge */}
                    <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-primary/10 rounded-lg">
                      <span className="text-sm font-bold text-primary">{index + 1}</span>
                    </div>

                    {/* Content */}
                    <div className="flex-grow min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                          {article.title}
                        </h3>
                      </div>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">{article.excerpt}</p>
                    </div>

                    {/* Read Time */}
                    <div className="hidden sm:flex flex-shrink-0 items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>{article.readTime}</span>
                    </div>

                    {/* Arrow */}
                    <div className="flex-shrink-0">
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </Link>
                ))}
              </div>

              {/* Mobile View All */}
              <div className="sm:hidden mt-5 pt-4 border-t border-border/50 text-center">
                <Link
                  href="/blogs"
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  View all guides
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
