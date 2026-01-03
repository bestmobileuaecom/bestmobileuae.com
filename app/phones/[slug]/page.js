export default async function PhoneDetailPage({ params }) {
  const paramsObj = await params; // ✅ unwrap the Promise
  console.log(paramsObj);

  return <h1>Phone Detail Page Coming Soon for {paramsObj.slug}</h1>;
}
