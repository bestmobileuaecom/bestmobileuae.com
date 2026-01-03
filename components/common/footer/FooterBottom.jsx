import Link from "next/link";
import UAEFlag from "@/components/ui/UAEFlag";

const legalLinks = [
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
  { label: "Cookie Policy", href: "#" },
];

export default function FooterBottom() {
  return (
    <div className="flex flex-col gap-4 text-xs text-muted-foreground">
      <div className="flex items-center gap-2">
        <UAEFlag className="w-6 h-4" />
        <p className="text-sm font-medium text-foreground">
          Made in UAE, for UAE. From the heart!
        </p>
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} UAEMobileGuide. All rights reserved.</p>

        <div className="flex gap-6">
          {legalLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
