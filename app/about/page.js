import { Info, Users, Shield, Target } from "lucide-react";
import PublicLayout from "@/components/common/PublicLayout";

export const metadata = {
  title: "About Us | Best Mobile UAE",
  description:
    "Learn about Best Mobile UAE - your trusted source for smartphone prices, comparisons, and reviews in the United Arab Emirates.",
  openGraph: {
    title: "About Us | Best Mobile UAE",
    description:
      "Your trusted source for smartphone prices, comparisons, and reviews in the UAE.",
    type: "website",
  },
};

const values = [
  {
    icon: Shield,
    title: "Transparency",
    description:
      "We provide honest, unbiased information to help you make informed decisions.",
  },
  {
    icon: Target,
    title: "Accuracy",
    description: "Our prices are updated regularly from trusted UAE retailers.",
  },
  {
    icon: Users,
    title: "User-First",
    description: "Everything we do is designed to save you time and money.",
  },
];

export default function AboutPage() {
  return (
    <PublicLayout>
      <div className="min-h-screen bg-linear-to-b from-background via-background to-muted/20 pb-12">
      {/* Header */}
      <section className="bg-linear-to-br from-primary/5 via-background to-accent/5 border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center bg-primary/10 rounded-xl">
              <Info className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                About Us
              </h1>
              <p className="text-sm text-muted-foreground">
                Learn more about Best Mobile UAE
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Mission */}
        <div className="bg-card border border-border/60 rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-foreground mb-3">
            Our Mission
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Best Mobile UAE helps you find the best smartphone deals in the
            United Arab Emirates. We compare prices across trusted retailers,
            provide detailed specifications, and offer honest reviews to make
            your buying decision easier.
          </p>
        </div>

        {/* Values */}
        <div className="bg-card border border-border/60 rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Our Values
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {values.map((value) => (
              <div
                key={value.title}
                className="flex flex-col items-center text-center p-4"
              >
                <div className="w-10 h-10 flex items-center justify-center bg-primary/10 rounded-xl mb-3">
                  <value.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-medium text-foreground mb-1">
                  {value.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="bg-card border border-border/60 rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-foreground mb-3">
            Contact Us
          </h2>
          <p className="text-muted-foreground">
            Have questions or feedback? Reach out to us at{" "}
            <a
              href="mailto:hello@bestmobileuae.com"
              className="text-primary hover:underline"
            >
              hello@bestmobileuae.com
            </a>
          </p>
        </div>
      </div>
    </div>
    </PublicLayout>
  );
}
