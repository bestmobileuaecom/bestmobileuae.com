import Breadcrumb from "@/components/common/Breadcrumb";
import PhoneDetailPage from "@/components/features/phones/PhoneDetailPage";
import { demoPhone } from "@/lib/demo-phone-data";

export default async function PhoneDetail({ params }) {
  const paramsObj = await params; // ✅ unwrap the Promise
  console.log(paramsObj);
  const phone = demoPhone[0];

  return (
    <>
      <Breadcrumb phone={phone} />
      <PhoneDetailPage phone={phone} />
    </>
  );
}
