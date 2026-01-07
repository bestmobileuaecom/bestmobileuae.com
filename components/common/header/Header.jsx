"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import { Menu, Search, Bell, X } from "lucide-react";
import Logo from "./Logo";
import NavMenu from "./Nav-Menu";
import SearchBar from "./SearchBar";
import FavoritesDropdown from "./FavoritesDropdown";

export default function Header() {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const mobileSearchRef = useRef(null);

  // Close mobile search when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (mobileSearchRef.current && !mobileSearchRef.current.contains(event.target)) {
        setMobileSearchOpen(false);
      }
    }
    if (mobileSearchOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [mobileSearchOpen]);

  // Focus input when mobile search opens
  useEffect(() => {
    if (mobileSearchOpen && mobileSearchRef.current) {
      const input = mobileSearchRef.current.querySelector("input");
      if (input) {
        setTimeout(() => input.focus(), 100);
      }
    }
  }, [mobileSearchOpen]);

  return (
    <header className="sticky top-0 z-50 w-full bg-background shadow-md">
      {/* Main Header */}
      <div className="border-b border-border">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          {/* Left: Mobile Menu + Logo */}
          <div className="flex items-center gap-3">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden h-10 w-10 rounded-lg border border-border bg-muted hover:bg-border text-foreground transition-colors"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open main menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-80 overflow-y-auto p-0 border-r-0 bg-card"
              >
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <div className="flex flex-col h-full">
                  {/* Mobile Logo */}
                  <div className="border-b border-border px-5 py-4 bg-muted">
                    <Logo />
                  </div>

                  {/* Mobile Search */}
                  <div className="px-5 py-4 border-b border-slate-100">
                    <SearchBar />
                  </div>

                  {/* Mobile Navigation */}
                  <div className="px-5 py-4">
                    <NavMenu vertical />
                  </div>

                  {/* Mobile CTA */}
                  <div className="mt-auto border-t border-border px-5 py-4 bg-muted">
                    <p className="text-xs text-foreground mb-3 font-medium">
                      🔔 Subscribe to price-drop alerts
                    </p>
                    <Link href="/phones" className="w-full">
                      <Button
                        className="w-full rounded-lg bg-primary hover:bg-primary/90 text-white font-semibold shadow-lg shadow-primary/20 px-4 py-2.5 transition-all active:scale-95"
                        size="md"
                      >
                        <Bell className="mr-2 h-4 w-4" /> Enable Alerts
                      </Button>
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <Logo />
          </div>

          {/* Center: Navigation */}
          <nav className="hidden lg:flex items-center">
            <NavMenu />
          </nav>

          {/* Right: Search + Actions */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Desktop Search */}
            <div className="hidden md:block w-56 lg:w-72">
              <SearchBar />
            </div>

            {/* Mobile Search Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileSearchOpen(true)}
              className="md:hidden h-10 w-10 rounded-lg border border-border bg-muted hover:bg-border text-foreground transition-colors"
            >
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>

            {/* Wishlist Button with Dropdown */}
            <FavoritesDropdown />

            {/* Desktop Price Alerts Button */}
            <Link href="/phones" className="hidden sm:inline-flex rounded-lg px-4 h-10 bg-linear-to-r from-primary to-primary hover:from-primary/90 hover:to-primary/90 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition-all active:scale-95 uae-shine items-center">
              <Bell className="mr-2 h-4 w-4" />
              <span className="hidden lg:inline">Price Alerts</span>
              <span className="lg:hidden">Alerts</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Search Overlay */}
      {mobileSearchOpen && (
        <div className="md:hidden fixed inset-0 z-60 bg-background/95 backdrop-blur-sm">
          <div className="flex flex-col h-full">
            {/* Search Header */}
            <div className="flex items-center gap-3 p-4 border-b border-border">
              <div ref={mobileSearchRef} className="flex-1">
                <SearchBar 
                  placeholder="Search phones, articles..." 
                  className="w-full"
                  onSelect={() => setMobileSearchOpen(false)}
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileSearchOpen(false)}
                className="h-10 w-10 rounded-lg border border-border bg-muted hover:bg-border text-foreground transition-colors shrink-0"
              >
                <X className="h-5 w-5" />
                <span className="sr-only">Close search</span>
              </Button>
            </div>
            
            {/* Search suggestions area */}
            <div className="flex-1 p-4">
              <p className="text-sm text-muted-foreground mb-4">Popular searches</p>
              <div className="flex flex-wrap gap-2">
                {["iPhone 16", "Samsung Galaxy S24", "Xiaomi 14", "Budget phones", "Gaming phones"].map((term) => (
                  <Link
                    key={term}
                    href={`/phones?search=${encodeURIComponent(term)}`}
                    onClick={() => setMobileSearchOpen(false)}
                    className="px-3 py-2 bg-muted hover:bg-muted/80 rounded-lg text-sm text-foreground transition-colors"
                  >
                    {term}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
