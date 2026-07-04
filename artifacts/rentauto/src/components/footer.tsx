import { Link } from "wouter";
import { Gauge, MapPin, MessageCircle, ShieldCheck, Tag, User } from "lucide-react";
import { BrandLogo } from "./brand-logo";
import { footerHighlights, siteConfig } from "@/lib/site-content";

const highlightIcons = [ShieldCheck, Gauge, User, MapPin, Tag];

const quickLinks = [
  { href: "/", label: "Inicio" },
  { href: "/nosotros", label: "Sobre Nosotros" },
  { href: "/flota", label: "Vehículos" },
  { href: "/preguntas-frecuentes", label: "Preguntas Frecuentes" },
  { href: "/contacto", label: "Contacto" },
  { href: "/admin", label: "Portal Admin" },
];

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="space-y-5">
            <BrandLogo layout="footer" linkToHome={false} />
            <p className="text-primary-foreground/70 text-sm leading-relaxed">
              {siteConfig.tagline}. Cotizaciones transparentes, todo incluido y sin
              sorpresas.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-sm uppercase tracking-[0.15em] mb-5 text-accent">
              Páginas
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-primary-foreground/70 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-sm uppercase tracking-[0.15em] mb-5 text-accent">
              Contacto
            </h3>
            <ul className="space-y-3 text-sm text-primary-foreground/70">
              <li>{siteConfig.address}</li>
              <li>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="hover:text-white transition-colors"
                >
                  {siteConfig.email}
                </a>
              </li>
              <li>
                <a href={siteConfig.phoneHref} className="hover:text-white transition-colors">
                  {siteConfig.phone}
                </a>
              </li>
              <li>{siteConfig.hours}</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-sm uppercase tracking-[0.15em] mb-5 text-accent">
              ¿Por qué elegirnos?
            </h3>
            <ul className="space-y-3">
              {footerHighlights.map((text, index) => {
                const Icon = highlightIcons[index];
                return (
                  <li key={text} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    <span className="text-sm text-primary-foreground/70 leading-snug">{text}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>



        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-primary-foreground/50">
          <p>&copy; {new Date().getFullYear()} {siteConfig.name}. Todos los derechos reservados.</p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <a href="#" className="hover:text-white transition-colors">Términos</a>
            <a href="#" className="hover:text-white transition-colors">Privacidad</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function WhatsAppButton() {
  return (
    <a
      href={siteConfig.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-accent text-white px-5 py-3 shadow-lg hover:bg-accent/90 transition-colors font-semibold text-sm uppercase tracking-wide"
      aria-label="Escribinos por WhatsApp"
    >
      <MessageCircle className="h-5 w-5" />
      <span className="hidden sm:inline">WhatsApp</span>
    </a>
  );
}
