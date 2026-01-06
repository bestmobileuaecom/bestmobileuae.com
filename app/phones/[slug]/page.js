import { notFound } from "next/navigation";
import Breadcrumb from "@/components/common/Breadcrumb";
import PhoneDetailPage from "@/components/features/phones/PhoneDetailPage";
import { getPhoneBySlug } from "@/lib/data/phones";
import PublicLayout from "@/components/common/PublicLayout";

export async function generateMetadata({ params }) {
  const { slug } = await params;

  let phone = null;
  try {
    phone = await getPhoneBySlug(slug, true);
  } catch (e) {
    console.error("Error fetching phone for metadata:", e);
  }

  if (!phone) {
    return { title: "Phone Not Found" };
  }

  return {
    title: `${phone.name} Price in UAE - Review & Specs | Best Mobile UAE`,
    description:
      phone.identity ||
      phone.verdict ||
      `${phone.name} price, specs, and review in UAE.`,
    openGraph: {
      title: `${phone.name} Price in UAE`,
      description: phone.identity || phone.verdict,
      type: "article",
      images: [phone.image],
    },
  };
}

export default async function PhoneDetail({ params, searchParams }) {
  const { slug } = await params;
  const { preview } = await searchParams;
  const includePreview = preview === "true";

  let phone = null;
  try {
    phone = await getPhoneBySlug(slug, includePreview);
  } catch (e) {
    console.error("Error fetching phone:", e);
  }

  if (!phone) {
    notFound();
  }

  return (
    <PublicLayout>
      <Breadcrumb phone={phone} />
      <PhoneDetailPage phone={phone} />
    </PublicLayout>
  );
}
