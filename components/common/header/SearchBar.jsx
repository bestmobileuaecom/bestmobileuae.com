"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Smartphone, Newspaper, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SearchBar({
  placeholder = "Search phones...",
  className,
  inputClassName,
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState({ phones: [], articles: [] });
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Debounced search
  useEffect(() => {
    if (!query || query.length < 2) {
      setResults({ phones: [], articles: [] });
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data);
        setIsOpen(true);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const hasResults = results.phones.length > 0 || results.articles.length > 0;

  const handleSelect = () => {
    setQuery("");
    setIsOpen(false);
    setResults({ phones: [], articles: [] });
  };

  return (
    <div className="relative">
      <div
        className={cn(
          "relative flex w-full items-center rounded-xl border border-border bg-muted transition-all focus-within:border-primary focus-within:bg-muted focus-within:ring-2 focus-within:ring-primary/20",
          className
        )}
      >
        <span className="pointer-events-none flex items-center pl-3.5 text-slate-400">
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
        </span>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && hasResults && setIsOpen(true)}
          placeholder={placeholder}
          className={cn(
            "h-10 flex-1 rounded-xl border-0 bg-transparent text-sm font-medium text-foreground focus-visible:ring-0 focus-visible:outline-none",
            "pl-2 pr-4 placeholder:text-slate-400",
            inputClassName
          )}
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setResults({ phones: [], articles: [] });
              setIsOpen(false);
            }}
            className="pr-3 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-lg z-50 max-h-[70vh] overflow-y-auto"
        >
          {hasResults ? (
            <div className="p-2">
              {/* Phones */}
              {results.phones.length > 0 && (
                <div className="mb-2">
                  <p className="text-xs font-medium text-muted-foreground px-2 py-1">
                    Phones
                  </p>
                  {results.phones.map((phone) => (
                    <Link
                      key={phone.id}
                      href={`/phones/${phone.slug}`}
                      onClick={handleSelect}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="relative w-10 h-10 bg-muted rounded-lg overflow-hidden shrink-0">
                        {phone.image ? (
                          <Image
                            src={phone.image}
                            alt={phone.name}
                            fill
                            className="object-contain p-1"
                          />
                        ) : (
                          <Smartphone className="w-5 h-5 text-muted-foreground/50 m-auto" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground text-sm truncate">
                          {phone.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {phone.price} • Score: {phone.score || "N/A"}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* Articles */}
              {results.articles.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground px-2 py-1">
                    Articles
                  </p>
                  {results.articles.map((article) => (
                    <Link
                      key={article.id}
                      href={`/blogs/${article.slug}`}
                      onClick={handleSelect}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center shrink-0">
                        <Newspaper className="w-5 h-5 text-muted-foreground/50" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground text-sm truncate">
                          {article.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {article.category}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* View all link */}
              <Link
                href={`/phones?search=${encodeURIComponent(query)}`}
                onClick={handleSelect}
                className="block text-center text-sm text-primary hover:text-primary/80 py-2 mt-2 border-t border-border"
              >
                View all results for "{query}"
              </Link>
            </div>
          ) : (
            <div className="p-6 text-center">
              <Search className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                No results found for "{query}"
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
