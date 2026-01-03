import Link from "next/link";

import {
  Smartphone,
  GitCompare,
  Newspaper,
  HelpCircle,
  Info,
} from "lucide-react";

const menuItems = [
  { title: "Mobiles", href: "/phones", icon: Smartphone },
  { title: "Compare", href: "/compare", icon: GitCompare },
  { title: "News & Reviews", href: "/blogs", icon: Newspaper },
  { title: "How to Use", href: "/how-to-use", icon: HelpCircle },
  { title: "About Us", href: "/about", icon: Info },
];

export default function NavMenu({ vertical = false }) {
  if (vertical) {
    return (
      <nav className="flex flex-col gap-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.title}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-foreground hover:bg-primary/10 hover:text-primary transition-colors font-medium"
            >
              <Icon className="h-4 w-4" />
              {item.title}
            </Link>
          );
        })}
      </nav>
    );
  }

  return (
    <nav className="flex items-center gap-1">
      {menuItems.map((item) => (
        <Link
          key={item.title}
          href={item.href}
          className="px-3.5 py-2 rounded-lg text-sm font-medium text-foreground hover:text-primary hover:bg-[border-border] transition-colors"
        >
          {item.title}
        </Link>
      ))}
    </nav>
  );
}
