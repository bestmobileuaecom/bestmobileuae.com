import BlogsClient from "./BlogsClient";

export const metadata = {
  title: "News & Reviews | Best Mobile UAE",
  description:
    "Latest smartphone news, in-depth reviews, and buying guides for the UAE market. Stay updated with the best mobile deals and comparisons.",
  openGraph: {
    title: "News & Reviews | Best Mobile UAE",
    description:
      "Latest smartphone news, in-depth reviews, and buying guides for the UAE market.",
    type: "website",
  },
};

export default function BlogsPage() {
  return <BlogsClient />;
}
