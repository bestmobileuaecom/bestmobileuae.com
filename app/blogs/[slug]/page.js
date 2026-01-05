import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, Clock, Tag, Newspaper } from "lucide-react";
import { getArticleBySlug, allArticles } from "@/lib/blogs-data";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  return allArticles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return { title: "Article Not Found" };

  return {
    title: `${article.title} | Best Mobile UAE`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      images: [article.image],
    },
  };
}

export default async function ArticlePage({ params }) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  // Get other articles excluding current one
  const otherArticles = allArticles.filter((a) => a.slug !== slug).slice(0, 4);

  return (
    <div className="min-h-screen bg-linear-to-b from-background via-background to-muted/20 pb-12">
      {/* Header */}
      <section className="bg-linear-to-br from-primary/5 via-background to-accent/5 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to News & Reviews
          </Link>

          <span className="inline-block bg-primary/10 text-primary text-xs font-medium px-2 py-1 rounded-full mb-3">
            {article.category}
          </span>

          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {article.date}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {article.readTime}
            </span>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Featured Image */}
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-card border border-border/60 shadow-sm">
              <Image
                src={article.image}
                alt={article.title}
                fill
                className="object-contain p-4"
              />
            </div>

            {/* Article Body */}
            <div className="bg-card border border-border/60 rounded-2xl shadow-sm p-6 md:p-8">
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {article.excerpt}
                </p>
                <hr className="my-6 border-border" />
                <p className="text-muted-foreground leading-relaxed">
                  This is a demo article. Full content would appear here with
                  detailed information about {article.title.toLowerCase()}.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Stay tuned for more updates and reviews from Best Mobile UAE.
                  We're committed to bringing you the latest smartphone news and
                  helping you find the best deals in the UAE market.
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Other Articles */}
            <div className="bg-card border border-border/60 rounded-2xl shadow-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <Newspaper className="w-4 h-4 text-primary" />
                <h3 className="font-semibold text-foreground">More Articles</h3>
              </div>
              <div className="space-y-3">
                {otherArticles.map((otherArticle) => (
                  <Link
                    key={otherArticle.id}
                    href={`/blogs/${otherArticle.slug}`}
                    className="group flex items-start gap-3 p-2 -mx-2 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="relative flex-shrink-0 w-12 h-12 bg-muted/30 rounded-lg overflow-hidden border border-border/40">
                      <Image
                        src={otherArticle.image}
                        alt={otherArticle.title}
                        fill
                        className="object-contain p-1"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-medium text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                        {otherArticle.category}
                      </span>
                      <h4 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2 mt-1">
                        {otherArticle.title}
                      </h4>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Back Link */}
            <Link
              href="/blogs"
              className="flex items-center justify-center gap-2 w-full py-3 bg-primary/10 text-primary hover:bg-primary/20 rounded-xl font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to News & Reviews
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
