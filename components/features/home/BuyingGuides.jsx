"use client";

import { Newspaper, ArrowRight, Clock, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const categoryColors = {
  Review: "bg-amber-500 text-white",
  News: "bg-blue-500 text-white",
  Guide: "bg-emerald-500 text-white",
  Comparison: "bg-purple-500 text-white",
};

function ArticleCard({ article }) {
  const badgeColor = categoryColors[article.category] || "bg-primary text-white";
  
  return (
    <Link
      href={`/blogs/${article.slug}`}
      className="group flex items-start gap-4 p-4 bg-muted/30 rounded-xl border border-border/40 hover:border-primary/40 hover:bg-muted/50 hover:shadow-md transition-all duration-200"
    >
      {/* Phone Image */}
      <div className="relative shrink-0 w-16 h-20 bg-white rounded-lg overflow-hidden border border-border/50 shadow-sm">
        {article.image ? (
          <Image
            src={article.image}
            alt={article.phone || article.title}
            fill
            className="object-contain p-1 group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-2xl">📱</div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Category Badge */}
        <div className="flex items-center gap-2 mb-1.5">
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${badgeColor}`}>
            {article.category}
          </span>
          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {article.readTime}
          </span>
        </div>
        
        {/* Title */}
        <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-1">
          {article.title}
        </h3>
        
        {/* Excerpt */}
        <p className="text-xs text-muted-foreground line-clamp-2">
          {article.excerpt}
        </p>
      </div>

      {/* Arrow */}
      <div className="shrink-0 self-center">
        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
      </div>
    </Link>
  );
}

export default function BuyingGuides({ articles = [] }) {
  // If no articles, don't render the section
  if (articles.length === 0) {
    return null;
  }

  return (
    <section className="py-6 md:py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Card Container */}
          <div className="bg-card border border-border/60 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-5 md:p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 flex items-center justify-center bg-primary/10 rounded-xl">
                    <Newspaper className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-foreground">News & Reviews</h2>
                    <p className="text-sm text-muted-foreground">Latest updates and expert reviews</p>
                  </div>
                </div>
                <Link
                  href="/blogs"
                  className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  All articles
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Articles Grid - 2 columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {articles.slice(0, 4).map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>

              {/* Mobile View All */}
              <div className="sm:hidden mt-5 pt-4 border-t border-border/50 text-center">
                <Link
                  href="/blogs"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary/10 hover:bg-primary/20 text-primary text-sm font-semibold rounded-lg transition-colors"
                >
                  View all articles
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
