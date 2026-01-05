import { Newspaper, ArrowRight, Clock, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const categoryColors = {
  Review: "bg-amber-500 text-white",
  News: "bg-blue-500 text-white",
  Guide: "bg-emerald-500 text-white",
  Comparison: "bg-purple-500 text-white",
};

export default function ArticleCard({ article }) {
  const badgeColor =
    categoryColors[article.category] || "bg-primary text-white";

  return (
    <Link
      href={`/blogs/${article.slug}`}
      className="group bg-card border border-border/60 rounded-2xl shadow-sm overflow-hidden hover:border-primary/40 hover:shadow-md transition-all duration-200"
    >
      {/* Featured Image */}
      <div className="relative h-40 md:h-48 bg-muted/30 overflow-hidden">
        {article.image ? (
          <Image
            src={article.image}
            alt={article.phone || article.title}
            fill
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">
            📱
          </div>
        )}
        {/* Category Badge Overlay */}
        <span
          className={`absolute top-3 left-3 text-[11px] font-semibold px-2.5 py-1 rounded-full ${badgeColor}`}
        >
          {article.category}
        </span>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Meta */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
          <span>{article.date}</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {article.readTime}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">
          {article.title}
        </h3>

        {/* Excerpt */}
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {article.excerpt}
        </p>

        {/* Read More */}
        <span className="inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-2 transition-all">
          Read more
          <ChevronRight className="w-4 h-4" />
        </span>
      </div>
    </Link>
  );
}
