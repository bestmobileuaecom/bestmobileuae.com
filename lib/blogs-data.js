// Demo blog/article data
export const allArticles = [
  {
    id: 1,
    title: "iPhone 16 Pro Max Review",
    excerpt:
      "Apple's latest flagship brings camera upgrades and new AI features that redefine mobile photography.",
    slug: "iphone-16-pro-max-review",
    category: "Review",
    readTime: "8 min",
    phone: "iPhone 16 Pro Max",
    image: "/mobile1.jpg",
    date: "2025-12-28",
    author: "Tech Team",
  },
  {
    id: 2,
    title: "Samsung Galaxy S25 Ultra First Look",
    excerpt:
      "Everything we know about Samsung's upcoming flagship including specs, price, and UAE availability.",
    slug: "samsung-galaxy-s25-ultra-first-look",
    category: "News",
    readTime: "5 min",
    phone: "Galaxy S25 Ultra",
    image: "/mobile1.jpg",
    date: "2025-12-25",
    author: "Tech Team",
  },
  {
    id: 3,
    title: "Google Pixel 9 Pro Review",
    excerpt:
      "The best camera phone gets even better with AI magic and improved computational photography.",
    slug: "google-pixel-9-pro-review",
    category: "Review",
    readTime: "7 min",
    phone: "Pixel 9 Pro",
    image: "/mobile1.jpg",
    date: "2025-12-20",
    author: "Tech Team",
  },
  {
    id: 4,
    title: "OnePlus 13 Launches in UAE",
    excerpt:
      "OnePlus brings its flagship killer to the Middle East with competitive pricing and premium features.",
    slug: "oneplus-13-launches-uae",
    category: "News",
    readTime: "4 min",
    phone: "OnePlus 13",
    image: "/mobile1.jpg",
    date: "2025-12-18",
    author: "Tech Team",
  },
  {
    id: 5,
    title: "Best Phones Under 1,000 AED in 2025",
    excerpt:
      "Top budget picks with great value for money that won't break the bank.",
    slug: "best-phones-under-1000-aed",
    category: "Guide",
    readTime: "6 min",
    phone: "Budget Phones",
    image: "/mobile1.jpg",
    date: "2025-12-15",
    author: "Tech Team",
  },
  {
    id: 6,
    title: "iPhone 16 vs Samsung S24: Which to Buy?",
    excerpt:
      "A detailed comparison of the two flagship titans to help you make the right choice.",
    slug: "iphone-16-vs-samsung-s24",
    category: "Comparison",
    readTime: "10 min",
    phone: "iPhone 16",
    image: "/mobile1.jpg",
    date: "2025-12-10",
    author: "Tech Team",
  },
  {
    id: 7,
    title: "Best Camera Phones Under 2,000 AED",
    excerpt:
      "Perfect for photography enthusiasts on a budget who want great shots without flagship prices.",
    slug: "best-camera-phones-under-2000",
    category: "Guide",
    readTime: "7 min",
    phone: "Camera Phones",
    image: "/mobile1.jpg",
    date: "2025-12-05",
    author: "Tech Team",
  },
  {
    id: 8,
    title: "Xiaomi 14 Ultra Review",
    excerpt:
      "Leica partnership delivers stunning photography capabilities in this camera-focused flagship.",
    slug: "xiaomi-14-ultra-review",
    category: "Review",
    readTime: "9 min",
    phone: "Xiaomi 14 Ultra",
    image: "/mobile1.jpg",
    date: "2025-12-01",
    author: "Tech Team",
  },
];

export const getArticleBySlug = (slug) => {
  return allArticles.find((article) => article.slug === slug);
};

export const getArticlesByCategory = (category) => {
  return allArticles.filter((article) => article.category === category);
};

export const categories = ["All", "Review", "News", "Guide", "Comparison"];
