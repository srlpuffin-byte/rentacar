import { useLocation, Link } from "wouter";
import { Menu, MessageCircle, ShoppingCart, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "./cart-context";
import { BrandLogo } from "./brand-logo";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/flota", label: "Vehículos" },
  { href: "/preguntas-frecuentes", label: "FAQ" },
  { href: "/contacto", label: "Contacto" },
];

export function Navbar() {
  const [location] = useLocation();
  const { items, setIsCartOpen } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-border/40 shadow-sm">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 flex items-center justify-between gap-3 h-20 md:h-24 lg:h-28">
        <BrandLogo layout="header" />

        <nav className="hidden md:flex items-center gap-0.5 lg:gap-1 flex-1 justify-center">
          {navLinks.map((link) => {
            const active = location === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative px-2 lg:px-3 py-2 text-[10px] lg:text-[11px] font-semibold tracking-wider uppercase transition-colors whitespace-nowrap",
                  active ? "text-accent" : "text-primary hover:text-accent",
                )}
              >
                {link.label}
                {active && (
                  <span className="absolute left-2 right-2 lg:left-3 lg:right-3 -bottom-0.5 h-[2px] rounded-full bg-accent" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-2 lg:gap-3 shrink-0">
          <Link
            href="/admin"
            className="text-[10px] lg:text-[11px] font-semibold uppercase tracking-wider text-primary/60 hover:text-accent transition-colors"
          >
            Admin
          </Link>
          <Button
            variant="outline"
            size="icon"
            className="relative rounded-full h-9 w-9 border-primary/15"
            onClick={() => setIsCartOpen(true)}
          >
            <ShoppingCart className="h-4 w-4" />
            {items.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-accent text-white text-[9px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                {items.length}
              </span>
            )}
          </Button>
          <Button
            asChild
            className="rounded-full bg-accent hover:bg-accent/90 text-white font-semibold uppercase tracking-wider text-[10px] lg:text-[11px] px-4 lg:px-6 h-9 lg:h-10 shadow-sm"
          >
            <Link href="/contacto">
              <MessageCircle className="h-3.5 w-3.5" />
              Contáctanos
            </Link>
          </Button>
        </div>

        <div className="flex md:hidden items-center gap-1 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="relative rounded-full h-9 w-9"
            onClick={() => setIsCartOpen(true)}
          >
            <ShoppingCart className="h-5 w-5" />
            {items.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-accent text-white text-[9px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                {items.length}
              </span>
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full h-9 w-9"
            onClick={() => setIsMobileMenuOpen((open) => !open)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden border-t bg-white px-4 py-3 flex flex-wrap items-center gap-1">
          {navLinks.map((link) => {
            const active = location === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "px-3 py-2 text-[11px] font-semibold uppercase tracking-wider rounded-md transition-colors",
                  active
                    ? "text-accent bg-accent/10"
                    : "text-primary hover:text-accent hover:bg-muted",
                )}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            href="/contacto"
            onClick={() => setIsMobileMenuOpen(false)}
            className="ml-auto rounded-full bg-accent text-white font-semibold uppercase tracking-wider text-[10px] px-4 py-2"
          >
            Contáctanos
          </Link>
        </div>
      )}
    </header>
  );
}
