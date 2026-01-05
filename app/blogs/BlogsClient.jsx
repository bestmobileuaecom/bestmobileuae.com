"use client";

import { useState } from "react";
import { Newspaper } from "lucide-react";
import { allArticles } from "@/lib/blogs-data";
import ArticleCard from "@/components/features/blogs/ArticleCard";
import CategoryFilter from "@/components/features/blogs/CategoryFilter";

export default function BlogsClient() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredArticles =
    activeCategory === "All"
      ? allArticles
      : allArticles.filter((article) => article.category === activeCategory);

  return (
    <div className="min-h-screen bg-linear-to-b from-background via-background to-muted/20 pb-12">
      {/* Header */}
      <section className="bg-linear-to-br from-primary/5 via-background to-accent/5 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center bg-primary/10 rounded-xl">
              <Newspaper className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                News & Reviews
              </h1>
              <p className="text-sm text-muted-foreground">
                Latest updates, reviews, and buying guides
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Category Filter */}
        <div className="mb-6">
          <CategoryFilter
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <Newspaper className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">
              No articles found in this category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
