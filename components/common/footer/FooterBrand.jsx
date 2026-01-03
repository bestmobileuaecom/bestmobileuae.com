import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import Logo from "../header/Logo";

const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
];

export default function FooterBrand() {
    return (
        <div className="md:col-span-1">
            <div className="mb-4">
                <Logo />
            </div>
            <p className="text-sm text-muted-foreground">
                Find the best phone deals across stores in the UAE.
            </p>
            <div className="mt-4 flex gap-3">
                {socialLinks.map(({ icon: Icon, href, label }) => (
                    <a
                        key={label}
                        href={href}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
                        aria-label={label}
                    >
                        <Icon className="h-4 w-4" />
                    </a>
                ))}
            </div>
        </div>
    );
}
