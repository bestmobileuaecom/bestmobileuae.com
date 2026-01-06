import Link from "next/link";
import { CheckCircle2, Bell, ArrowLeft, Home } from "lucide-react";
import PublicLayout from "@/components/common/PublicLayout";

export default async function AlertSetPage({ searchParams }) {
  const params = await searchParams;
  const phoneName = params?.phone || "the phone";

  return (
    <PublicLayout>
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50/50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Success Icon */}
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-4">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
        </div>

        {/* Success Message */}
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
          Price Alert Set!
        </h1>
        
        <p className="text-muted-foreground mb-2">
          You&apos;ll receive an email notification when the price drops for:
        </p>
        
        <p className="font-semibold text-foreground text-lg mb-6">
          {phoneName}
        </p>

        {/* Info Box */}
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-8">
          <div className="flex items-center justify-center gap-2 text-primary mb-2">
            <Bell className="w-5 h-5" />
            <span className="font-semibold">How it works</span>
          </div>
          <p className="text-sm text-muted-foreground">
            We monitor prices daily. When the price drops below the current level, 
            you&apos;ll get an instant email notification.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/phones"
            className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-6 rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-primary/20"
          >
            <ArrowLeft className="w-4 h-4" />
            Browse More Phones
          </Link>
          
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground font-medium py-3 px-6 rounded-xl border border-border hover:border-primary/30 hover:bg-primary/5 transition-all"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Link>
        </div>

        {/* Unsubscribe Note */}
        <p className="text-xs text-muted-foreground mt-8">
          You can unsubscribe anytime by clicking the link in our emails.
        </p>
      </div>
    </div>
    </PublicLayout>
  );
}
