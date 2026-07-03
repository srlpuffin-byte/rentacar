import { CheckCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { aboutContent, siteConfig } from "@/lib/site-content";

export default function About() {
  return (
    <div className="bg-background">
      <div className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-extrabold uppercase mb-6">
            {aboutContent.title}
          </h1>
          <p className="text-xl opacity-90 leading-relaxed">{aboutContent.description}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-extrabold uppercase text-primary text-center mb-12">
            {aboutContent.valuesTitle}
          </h2>
          <div className="grid md:grid-cols-2 gap-8 mb-20">
            {aboutContent.values.map((value) => (
              <div
                key={value.title}
                className="rounded-2xl border bg-card p-8 shadow-sm"
              >
                <h3 className="text-xl font-bold text-primary mb-3">{value.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-3xl font-extrabold uppercase text-primary mb-6">
                {aboutContent.benefitsTitle}
              </h2>
              <ul className="space-y-3">
                {aboutContent.benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl bg-primary text-primary-foreground p-10">
              <h3 className="text-2xl font-bold mb-4">Llámanos ahora</h3>
              <p className="text-primary-foreground/80 mb-6 leading-relaxed">
                El servicio de atención al cliente está aquí para ayudarte en cualquier
                momento.
              </p>
              <a
                href={siteConfig.phoneHref}
                className="inline-flex items-center gap-3 text-2xl font-extrabold text-accent hover:text-white transition-colors"
              >
                <Phone className="h-7 w-7" />
                {siteConfig.phone}
              </a>
              <div className="mt-8">
                <Button
                  asChild
                  className="rounded-full bg-accent hover:bg-accent/90 text-white font-semibold uppercase tracking-wide px-8 h-12"
                >
                  <Link href="/contacto">Contactanos</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
