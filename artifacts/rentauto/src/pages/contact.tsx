import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { siteConfig } from "@/lib/site-content";

export default function Contact() {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Mensaje enviado",
      description: "Nos pondremos en contacto contigo lo antes posible.",
    });
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="bg-background min-h-screen">
      <div className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-extrabold uppercase mb-6">Contactanos</h1>
          <p className="text-xl opacity-90 leading-relaxed">
            Mantengamos nuestra comunicación. Estamos aquí para ayudarte con tu reserva en
            Miami y Orlando.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 -mt-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="lg:col-span-2 shadow-xl border-0">
            <CardHeader className="p-8 pb-4">
              <CardTitle className="text-2xl font-bold">Envíanos un mensaje</CardTitle>
            </CardHeader>
            <CardContent className="p-8 pt-0">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Nombre y Apellido
                    </label>
                    <Input
                      id="name"
                      required
                      placeholder="Nombre y Apellido"
                      className="h-12 bg-muted/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium">
                      Teléfono
                    </label>
                    <Input
                      id="phone"
                      required
                      placeholder="Teléfono"
                      className="h-12 bg-muted/50"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Dirección de correo electrónico
                  </label>
                  <Input
                    id="email"
                    type="email"
                    required
                    placeholder="Dirección de correo electrónico"
                    className="h-12 bg-muted/50"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    Mensaje
                  </label>
                  <Textarea
                    id="message"
                    required
                    placeholder="Texto"
                    className="min-h-[150px] bg-muted/50 resize-y"
                  />
                </div>
                <Button type="submit" size="lg" className="w-full md:w-auto h-12 px-8">
                  Enviar mensaje
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-8">
            <Card className="bg-primary text-primary-foreground border-0 shadow-xl h-full">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Información de Contacto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="bg-primary-foreground/10 p-3 rounded-full mt-1">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Ubicación</h3>
                    <p className="text-primary-foreground/80">{siteConfig.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary-foreground/10 p-3 rounded-full mt-1">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Teléfono</h3>
                    <a
                      href={siteConfig.phoneHref}
                      className="text-primary-foreground/80 hover:text-white transition-colors"
                    >
                      {siteConfig.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary-foreground/10 p-3 rounded-full mt-1">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Correo</h3>
                    <a
                      href={`mailto:${siteConfig.email}`}
                      className="text-primary-foreground/80 hover:text-white transition-colors"
                    >
                      {siteConfig.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary-foreground/10 p-3 rounded-full mt-1">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Horario</h3>
                    <p className="text-primary-foreground/80">{siteConfig.hours}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="bg-accent/10 border-accent/20 border rounded-2xl p-8 md:p-12 text-center max-w-4xl mx-auto flex flex-col items-center">
          <h2 className="text-3xl font-extrabold uppercase text-primary mb-4">
            ¿Necesitas un vehículo?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
            Te entregamos tu vehículo en la puerta del aeropuerto de Miami/Orlando y hasta
            en Miami Beach.
          </p>
          <Button asChild size="lg" className="px-10 h-14 text-lg bg-accent hover:bg-accent/90 text-white">
            <Link href="/flota">Ver Vehículos</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
