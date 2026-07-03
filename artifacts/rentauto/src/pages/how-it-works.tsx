import { FaqSection } from "@/components/faq-section";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { siteConfig } from "@/lib/site-content";

export default function HowItWorks() {
  return (
    <div className="bg-background">
      <div className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-extrabold uppercase mb-6">
            Preguntas Frecuentes
          </h1>
          <p className="text-xl opacity-90 leading-relaxed">
            Resolvemos las dudas más comunes sobre la renta de vehículos en Miami y Orlando.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-20">
        <FaqSection showHeader={false} />
      </div>

      <div className="bg-muted py-20 text-center">
        <div className="container mx-auto px-4 max-w-2xl">
          <h2 className="text-3xl font-extrabold uppercase text-primary mb-6">
            ¿Tenés más consultas?
          </h2>
          <p className="text-xl text-muted-foreground mb-4">
            Escribinos o llamanos al{" "}
            <a href={siteConfig.phoneHref} className="text-accent font-semibold hover:underline">
              {siteConfig.phone}
            </a>
          </p>
          <Button asChild size="lg" className="rounded-full px-12 h-12 mt-6">
            <Link href="/contacto">Contactanos</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
