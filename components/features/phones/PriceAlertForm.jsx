/**
 * Price Alert Form - Simple email-only subscription for price drop alerts
 * No client-side JS needed - uses native form submission
 */
import { Bell, Mail } from "lucide-react";

export default function PriceAlertForm({ phoneId, phoneName }) {
  return (
    <div className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-xl p-4 md:p-5 border border-primary/20">
      <div className="flex items-start gap-3 mb-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Bell className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground text-sm md:text-base">
            Price Drop Alert
          </h3>
          <p className="text-xs md:text-sm text-muted-foreground">
            Get notified when the price drops
          </p>
        </div>
      </div>

      <form 
        action="/api/price-alert" 
        method="POST" 
        className="flex flex-col sm:flex-row gap-2"
      >
        <input type="hidden" name="phoneId" value={phoneId} />
        <input type="hidden" name="phoneName" value={phoneName} />
        
        <div className="relative flex-1">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="email"
            name="email"
            required
            placeholder="Enter your email"
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
          />
        </div>
        
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2.5 px-5 rounded-lg transition-all active:scale-[0.98] shadow-md shadow-primary/20 text-sm whitespace-nowrap"
        >
          <Bell className="w-4 h-4" />
          Enable Alert
        </button>
      </form>
      
      <p className="text-[10px] md:text-xs text-muted-foreground mt-2">
        We&apos;ll only email you when the price drops. No spam, unsubscribe anytime.
      </p>
    </div>
  );
}
