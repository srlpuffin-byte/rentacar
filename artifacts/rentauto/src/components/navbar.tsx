import { useLocation, Link } from "wouter";
import { Car, Menu, ShoppingCart, X, Shield, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "./cart-context";
import { useState } from "react";

export function Navbar() {
  const [location] = useLocation();
  const { items, setIsCartOpen } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Inicio" },
    { href: "/flota", label: "Flota" },
    { href: "/como-funciona", label: "Cómo Funciona" },
    { href: "/contacto", label: "Contacto" },
  ];

  const toggleCart = () => setIsCartOpen(true);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 text-primary font-bold text-xl tracking-tight">
            <Car className="h-6 w-6" />
            <span>RentAuto</span>
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location === link.href ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Link href="/admin" className="text-sm font-medium text-muted-foreground hover:text-primary">
            Admin
          </Link>
          <Button variant="outline" size="icon" className="relative" onClick={toggleCart}>
            <ShoppingCart className="h-5 w-5" />
            {items.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center">
                {items.length}
              </span>
            )}
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex md:hidden items-center gap-4">
          <Button variant="ghost" size="icon" className="relative" onClick={toggleCart}>
            <ShoppingCart className="h-5 w-5" />
            {items.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center">
                {items.length}
              </span>
            )}
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b bg-background">
          <nav className="flex flex-col p-4 gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location === link.href ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-medium text-muted-foreground hover:text-primary">
              Admin
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
