import FooterBrand from "./FooterBrand";
import FooterLinks from "./FooterLinks";
import FooterBrands from "./FooterBrands";
import FooterBottom from "./FooterBottom";

export default function Footer() {
    return (
        <footer className="bg-muted/20 text-foreground border-t border-border">
            <div className="mx-auto max-w-7xl px-4 md:px-6 py-8 md:py-14">
                {/* Top Section */}
                <div className="grid gap-8 md:gap-12 grid-cols-2 sm:grid-cols-3 md:grid-cols-5 mb-8 md:mb-10 pb-8 md:pb-10 border-b border-border">
                    <div className="col-span-2 sm:col-span-3 md:col-span-1">
                        <FooterBrand />
                    </div>
                    <FooterLinks />
                    <FooterBrands />
                </div>
                {/* Bottom Section */}
                <FooterBottom />
            </div>
        </footer>
    );
}
