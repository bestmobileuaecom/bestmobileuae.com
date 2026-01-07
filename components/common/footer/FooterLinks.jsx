import Link from "next/link";

const linkSections = [
  {
    title: "Browse",
    links: [
      { label: "All Phones", href: "/phones" },
      { label: "Compare Phones", href: "/compare" },
      { label: "News & Reviews", href: "/blogs" },
    ],
  },
  {
    title: "Categories",
    links: [
      { label: "Budget Phones", href: "/phones?budget=1500" },
      { label: "Gaming Phones", href: "/phones?priority=gaming" },
      { label: "Flagship Phones", href: "/phones?budget=flagship" },
      { label: "Camera Phones", href: "/phones?priority=camera" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "How to Use", href: "/how-to-use" },
      { label: "News & Reviews", href: "/blogs" },
    ],
  },
];

export function FooterLinkSection({ title, links }) {
  return (
    <div>
      <h3 className="font-semibold mb-4 text-foreground">{title}</h3>
      <ul className="space-y-2 text-sm text-muted-foreground">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function FooterLinks() {
  return (
    <>
      {linkSections.map((section) => (
        <FooterLinkSection
          key={section.title}
          title={section.title}
          links={section.links}
        />
      ))}
    </>
  );
}
