import {
  HelpCircle,
  Search,
  GitCompareArrows,
  ShoppingCart,
  Star,
} from "lucide-react";
import PublicLayout from "@/components/common/PublicLayout";

export const metadata = {
  title: "How to Use | Best Mobile UAE",
  description:
    "Learn how to use Best Mobile UAE to find the best smartphone prices, compare phones, and make smart buying decisions in the UAE.",
  openGraph: {
    title: "How to Use | Best Mobile UAE",
    description:
      "Learn how to find the best smartphone prices and compare phones in the UAE.",
    type: "website",
  },
};

const steps = [
  {
    icon: Search,
    title: "Browse or Search",
    description:
      "Use the search bar or browse our catalog to find the phone you're interested in.",
  },
  {
    icon: Star,
    title: "Check Prices & Scores",
    description:
      "View our price comparisons across UAE retailers and see our expert ratings for each device.",
  },
  {
    icon: GitCompareArrows,
    title: "Compare Phones",
    description:
      "Add phones to your compare list to see specs side-by-side and find the best fit for you.",
  },
  {
    icon: ShoppingCart,
    title: "Buy with Confidence",
    description:
      "Click through to trusted retailers to purchase at the best price. We update prices regularly.",
  },
];

export default function HowToUsePage() {
  return (
    <PublicLayout>
      <div className="min-h-screen bg-linear-to-b from-background via-background to-muted/20 pb-12">
      {/* Header */}
      <section className="bg-linear-to-br from-primary/5 via-background to-accent/5 border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center bg-primary/10 rounded-xl">
              <HelpCircle className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                How to Use
              </h1>
              <p className="text-sm text-muted-foreground">
                Get the most out of Best Mobile UAE
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Steps */}
        <div className="bg-card border border-border/60 rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Getting Started
          </h2>
          <div className="space-y-4">
            {steps.map((step, index) => (
              <div key={step.title} className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-primary/10 rounded-xl">
                  <step.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">
                    {index + 1}. {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div className="bg-card border border-border/60 rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-foreground mb-3">
            Pro Tips
          </h2>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              Use filters to narrow down by price range, brand, or features.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              Compare up to 3 phones at once for the best side-by-side view.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              Check our News & Reviews section for the latest deals and updates.
            </li>
          </ul>
        </div>
      </div>
    </div>
    </PublicLayout>
  );
}
