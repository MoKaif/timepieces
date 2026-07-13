/**
 * Main Layout — Midnight Dial
 * Fixed header with a dial brandmark, minute-track underline nav, and a footer
 * that reports the live collection register.
 */

import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Download, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCollection } from "@/contexts/CollectionContext";
import { formatCompactINR } from "@/lib/format";
import { toast } from "sonner";

interface LayoutProps {
  children: React.ReactNode;
  currentPage?: "dashboard" | "gallery" | "wishlist" | "add" | "analytics" | "settings";
}

/** Minimal watch-dial brandmark. */
function DialMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} fill="none" aria-hidden="true">
      <circle cx="20" cy="20" r="17" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
      <circle cx="20" cy="20" r="13.5" stroke="currentColor" strokeWidth="0.75" opacity="0.35" />
      {/* hour indices */}
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i * 30 * Math.PI) / 180;
        const r1 = i % 3 === 0 ? 10.5 : 12;
        const x1 = 20 + Math.sin(a) * r1;
        const y1 = 20 - Math.cos(a) * r1;
        const x2 = 20 + Math.sin(a) * 13;
        const y2 = 20 - Math.cos(a) * 13;
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth={i % 3 === 0 ? 1.4 : 0.8} />;
      })}
      {/* hands */}
      <line x1="20" y1="20" x2="20" y2="11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <line x1="20" y1="20" x2="27" y2="23" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="20" cy="20" r="1.5" fill="currentColor" />
    </svg>
  );
}

export function Layout({ children, currentPage }: LayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { stats, exportData, importData } = useCollection();
  const importInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 24);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = [
    { label: "Dashboard", href: "/", page: "dashboard" },
    { label: "Gallery", href: "/gallery", page: "gallery" },
    { label: "Wishlist", href: "/wishlist", page: "wishlist" },
    { label: "Analytics", href: "/analytics", page: "analytics" },
    { label: "Add", href: "/add", page: "add" },
    { label: "Settings", href: "/settings", page: "settings" },
  ];

  const handleExport = async () => {
    try {
      await exportData();
      toast.success("Collection exported");
    } catch {
      toast.error("Could not export the collection");
    }
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      await importData(file, false);
      toast.success("Collection imported");
    } catch {
      toast.error("Could not read that file. Export a collection to see the format.");
    } finally {
      if (importInputRef.current) importInputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-background/92 backdrop-blur-md border-b border-border" : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="container max-w-7xl mx-auto flex items-center justify-between py-4">
          <Link href="/">
            <a className="flex items-center gap-3 group cursor-pointer">
              <DialMark className="w-9 h-9 text-primary transition-colors group-hover:text-[color-mix(in_srgb,var(--primary)_70%,white)]" />
              <div className="leading-none">
                <h1 className="text-xl font-display font-semibold tracking-tight text-foreground">Timepieces</h1>
                <p className="eyebrow mt-1">Collection Register</p>
              </div>
            </a>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {menuItems.map((item) => {
              const active = currentPage === item.page;
              return (
                <Link key={item.href} href={item.href}>
                  <a
                    className={`relative px-3.5 py-2 text-sm transition-colors ${
                      active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {item.label}
                    {active && <span className="absolute left-3.5 right-3.5 -bottom-0.5 h-px bg-primary" />}
                  </a>
                </Link>
              );
            })}

            <span className="mx-2 h-5 w-px bg-border" />

            <Button variant="ghost" size="sm" title="Export collection" onClick={handleExport} className="text-muted-foreground hover:text-primary">
              <Download className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              title="Import collection"
              onClick={() => importInputRef.current?.click()}
              className="text-muted-foreground hover:text-primary"
            >
              <Upload className="w-4 h-4" />
            </Button>
          </nav>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-foreground hover:text-primary transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <nav className="md:hidden bg-card border-t border-border">
            <div className="container max-w-7xl mx-auto py-4 space-y-1">
              {menuItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <a
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-3 py-2 rounded-md text-sm transition-colors ${
                      currentPage === item.page ? "bg-primary/15 text-primary" : "text-foreground hover:bg-secondary"
                    }`}
                  >
                    {item.label}
                  </a>
                </Link>
              ))}
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" onClick={handleExport} className="flex-1">
                  <Download className="w-4 h-4 mr-2" /> Export
                </Button>
                <Button variant="outline" size="sm" onClick={() => importInputRef.current?.click()} className="flex-1">
                  <Upload className="w-4 h-4 mr-2" /> Import
                </Button>
              </div>
            </div>
          </nav>
        )}
      </header>

      <input ref={importInputRef} type="file" accept=".json,application/json" onChange={handleImportFile} className="hidden" />

      <main className="pt-20">{children}</main>

      <footer className="border-t border-border mt-24">
        <div className="container max-w-7xl mx-auto py-14">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <DialMark className="w-5 h-5 text-primary" />
                <span className="font-display text-lg font-semibold">Timepieces</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                A private register for a watch collection — track each piece, its valuation, and how the collection moves over time.
              </p>
            </div>

            <div>
              <p className="eyebrow mb-4">The Register</p>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p className="flex justify-between max-w-[14rem]">
                  <span>Pieces</span>
                  <span className="num text-foreground">{stats.totalWatches}</span>
                </p>
                <p className="flex justify-between max-w-[14rem]">
                  <span>Portfolio value</span>
                  <span className="num text-foreground">{formatCompactINR(stats.totalValue)}</span>
                </p>
                <p className="flex justify-between max-w-[14rem]">
                  <span>Average piece</span>
                  <span className="num text-foreground">{formatCompactINR(stats.averageValue)}</span>
                </p>
              </div>
            </div>

            <div>
              <p className="eyebrow mb-4">Stored</p>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                Your collection lives in your own PostgreSQL database via the app's API — not the browser. Export any time to a JSON backup.
              </p>
            </div>
          </div>

          <div className="minute-track mb-6" />
          <div className="text-center eyebrow">© {new Date().getFullYear()} Timepieces · Kept with precision</div>
        </div>
      </footer>
    </div>
  );
}
