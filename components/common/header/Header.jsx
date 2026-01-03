import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import { Menu, Search, Heart, Bell } from "lucide-react";
import Logo from "./Logo";
import NavMenu from "./Nav-Menu";
import SearchBar from "./SearchBar";

export default function Header() {
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
                    <Button
                      className="w-full rounded-lg bg-primary hover:bg-primary/90 text-white font-semibold shadow-lg shadow-primary/20 px-4 py-2.5 transition-all active:scale-95"
                      size="md"
                    >
                      <Bell className="mr-2 h-4 w-4" /> Enable Alerts
                    </Button>
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
              className="md:hidden h-10 w-10 rounded-lg border border-border bg-muted hover:bg-border text-foreground transition-colors"
            >
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>

            {/* Wishlist Button */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex h-10 w-10 rounded-lg border border-border bg-muted hover:bg-border text-foreground relative transition-colors"
            >
              <Heart className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-bold text-white flex items-center justify-center shadow-sm">
                3
              </span>
            </Button>

            <Button className="hidden sm:inline-flex rounded-lg px-4 h-10 bg-gradient-to-r from-primary to-primary hover:from-primary/90 hover:to-primary/90 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition-all active:scale-95 uae-shine">
              <Bell className="mr-2 h-4 w-4" />
              <span className="hidden lg:inline">Price Alerts</span>
              <span className="lg:hidden">Alerts</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
