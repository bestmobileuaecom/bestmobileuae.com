import FooterBrand from "./FooterBrand";
import FooterLinks from "./FooterLinks";
import FooterBrands from "./FooterBrands";
import FooterBottom from "./FooterBottom";

export default function Footer() {
    return (
        <footer className="bg-muted/20 text-foreground border-t border-border">
            <div className="mx-auto max-w-7xl px-4 md:px-6 py-10 md:py-14">
                {/* Top Section */}
                <div className="grid gap-10 md:gap-12 md:grid-cols-5 mb-10 pb-10 border-b border-border">
                    <FooterBrand />
                    <FooterLinks />
                    <FooterBrands />
                </div>
                {/* Bottom Section */}
                <FooterBottom />
            </div>
        </footer>
    );
}
