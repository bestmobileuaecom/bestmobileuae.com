/**
 * Product Image Section - Left side with phone image, brand badge, and action buttons
 */
"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Heart, Share2, Check } from "lucide-react";
import { isPhoneLiked, togglePhoneLike } from "@/lib/favorites";

export default function ProductImageSection({ phone }) {
  const [liked, setLiked] = useState(false);
  const [showCopied, setShowCopied] = useState(false);

  // Check cookie for like status on mount
  useEffect(() => {
    if (phone?.slug) {
      setLiked(isPhoneLiked(phone.slug));
    }
  }, [phone?.slug]);

  const handleLike = () => {
    if (phone?.slug) {
      const newStatus = togglePhoneLike(phone.slug);
      setLiked(newStatus);
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: phone.name,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setShowCopied(true);
        setTimeout(() => setShowCopied(false), 2000);
      }
    } catch (err) {
      // User cancelled share
    }
  };

  return (
    <div className="relative w-full md:w-[320px] lg:w-[400px] flex-shrink-0 bg-gradient-to-br from-secondary via-muted/50 to-secondary">
      {/* Top Actions */}
      <div className="absolute top-3 md:top-4 left-3 md:left-4 right-3 md:right-4 flex items-center justify-between z-10">
        {phone.brand && (
          <span className="text-[9px] md:text-[10px] font-bold text-muted-foreground uppercase tracking-wider bg-card/90 backdrop-blur-sm px-2 md:px-3 py-1 md:py-1.5 rounded-full border border-border">
            {phone.brand}
          </span>
        )}
        <div className="flex items-center gap-1.5 md:gap-2">
          <button
            type="button"
            onClick={handleShare}
            className="relative h-8 w-8 md:h-9 md:w-9 flex items-center justify-center rounded-full bg-card/90 backdrop-blur-sm border border-border text-muted-foreground active:scale-95 hover:text-primary hover:border-primary/30 transition-all"
            aria-label="Share"
          >
            {showCopied ? (
              <Check className="h-3.5 w-3.5 md:h-4 md:w-4 text-emerald-500" />
            ) : (
              <Share2 className="h-3.5 w-3.5 md:h-4 md:w-4" />
            )}
          </button>
          <button
            type="button"
            onClick={handleLike}
            className={`h-8 w-8 md:h-9 md:w-9 flex items-center justify-center rounded-full backdrop-blur-sm border active:scale-95 transition-all ${
              liked
                ? "bg-primary/10 border-primary/30 text-primary"
                : "bg-card/90 border-border text-muted-foreground hover:text-primary hover:border-primary/30"
            }`}
            aria-label={liked ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart
              className={`h-3.5 w-3.5 md:h-4 md:w-4 ${liked ? "fill-current" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Phone Image */}
      <div className="flex items-center justify-center p-4 pt-14 pb-6 md:p-8 md:pt-16 md:pb-10 min-h-[280px] md:min-h-[360px] lg:min-h-[400px]">
        <div className="relative w-[160px] h-[200px] sm:w-[180px] sm:h-[240px] md:w-[220px] md:h-[300px] lg:w-[260px] lg:h-[350px] drop-shadow-2xl">
          <Image
            src={phone.image || "/placeholder-phone.png"}
            alt={phone.name}
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>
    </div>
  );
}
