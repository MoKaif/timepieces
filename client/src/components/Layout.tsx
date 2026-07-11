/**
 * Main Layout Component
 * Cinematic Luxury Design: Dark background with gold accents, minimal navigation
 */

import React, { useState, useEffect } from "react";
import { Link } from "wouter";
import { Menu, X, Download, Upload, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCollection } from "@/contexts/CollectionContext";

interface LayoutProps {
  children: React.ReactNode;
  currentPage?: "dashboard" | "gallery" | "add" | "analytics" | "settings";
}

export function Layout({ children, currentPage }: LayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { stats } = useCollection();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = [
    { label: "Dashboard", href: "/", page: "dashboard" },
    { label: "Gallery", href: "/gallery", page: "gallery" },
    { label: "Analytics", href: "/analytics", page: "analytics" },
    { label: "Add Watch", href: "/add", page: "add" },
    { label: "Settings", href: "/settings", page: "settings" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-background/95 backdrop-blur-md border-b border-border shadow-lg" : "bg-transparent"
        }`}
      >
        <div className="container max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <a className="flex items-center gap-3 group cursor-pointer">
              {/* Crown Logo - Luxe Gold */}
              <div className="w-10 h-10 flex items-center justify-center">
                <svg
                  viewBox="0 0 40 40"
                  className="w-full h-full text-accent group-hover:text-white transition-colors duration-300"
                  fill="currentColor"
                >
                  {/* Crown symbol */}
                  <path d="M8 24h24v2H8z" />
                  <path d="M10 14l6 8h8l6-8M14 10l4 6M26 10l-4 6M20 6l3 6" stroke="currentColor" strokeWidth="1.5" fill="none" />
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-display font-bold text-white">Horological</h1>
                <p className="text-xs text-muted-foreground">Collection Portfolio</p>
              </div>
            </a>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {menuItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <a
                  className={`px-4 py-2 rounded-md transition-all duration-200 text-sm font-medium ${
                    currentPage === item.page
                      ? "bg-accent text-accent-foreground"
                      : "text-foreground hover:bg-accent/20 hover:text-accent"
                  }`}
                >
                  {item.label}
                </a>
              </Link>
            ))}
          </nav>

          {/* Quick Actions */}
          <div className="hidden md:flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              title="Export Collection"
              className="text-muted-foreground hover:text-accent"
            >
              <Download className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              title="Import Collection"
              className="text-muted-foreground hover:text-accent"
            >
              <Upload className="w-4 h-4" />
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-foreground hover:text-accent transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden bg-card border-t border-border">
            <div className="container max-w-7xl mx-auto px-4 py-4 space-y-2">
              {menuItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <a
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-4 py-2 rounded-md transition-all duration-200 text-sm font-medium ${
                      currentPage === item.page
                        ? "bg-accent text-accent-foreground"
                        : "text-foreground hover:bg-accent/20 hover:text-accent"
                    }`}
                  >
                    {item.label}
                  </a>
                </Link>
              ))}
            </div>
          </nav>
        )}
      </header>

      {/* Main Content */}
      <main className="pt-20">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-20">
        <div className="container max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* About */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-accent mb-4">About</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                A premium collection management platform for horological enthusiasts. Track, analyze, and showcase your timepiece investments.
              </p>
            </div>

            {/* Quick Stats */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-accent mb-4">Collection</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>
                  <span className="text-accent font-semibold">{stats.totalWatches}</span> Watches
                </p>
                <p>
                  <span className="text-accent font-semibold">₹{(stats.totalValue / 1000).toFixed(0)}K</span> Total Value
                </p>
                <p>
                  <span className="text-accent font-semibold">₹{(stats.averageValue / 1000).toFixed(0)}K</span> Average Value
                </p>
              </div>
            </div>

            {/* Features */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-accent mb-4">Features</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Local Data Storage</li>
                <li>• Advanced Analytics</li>
                <li>• Import/Export</li>
                <li>• Responsive Design</li>
              </ul>
            </div>
          </div>

          {/* Divider */}
          <div className="divider-gold my-8" />

          {/* Copyright */}
          <div className="text-center text-xs text-muted-foreground">
            <p>© {new Date().getFullYear()} Horological Collection Portfolio. All rights reserved.</p>
            <p className="mt-2">Crafted with precision and passion for watch collectors.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
