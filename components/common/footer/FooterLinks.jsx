import Link from "next/link";

const linkSections = [
  {
    title: "Browse",
    links: [
      { label: "All phones", href: "/phones" },
      { label: "Latest launches", href: "/phones" },
      { label: "Compare phones", href: "/phones" },
      { label: "Price tracker", href: "/phones" },
    ],
  },
  {
    title: "Categories",
    links: [
      { label: "Budget phones", href: "/phones" },
      { label: "Gaming phones", href: "/phones" },
      { label: "Flagship phones", href: "/phones" },
      { label: "Camera phones", href: "/phones" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About us", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Contact", href: "#" },
      { label: "Careers", href: "#" },
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
