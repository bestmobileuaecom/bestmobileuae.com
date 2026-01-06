import BlogsClient from "./BlogsClient";
import PublicLayout from "@/components/common/PublicLayout";

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
  return (
    <PublicLayout>
      <BlogsClient />
    </PublicLayout>
  );
}
