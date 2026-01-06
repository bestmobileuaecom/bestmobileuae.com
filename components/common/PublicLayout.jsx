import Header from "@/components/common/header";
import Footer from "@/components/common/footer";

export default function PublicLayout({ children }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
