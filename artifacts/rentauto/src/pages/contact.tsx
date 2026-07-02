import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

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
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Contáctanos</h1>
          <p className="text-xl opacity-90">
            Estamos aquí para ayudarte. Si tienes alguna pregunta sobre nuestras reservas o servicios, no dudes en escribirnos.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 -mt-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          
          {/* Contact Form */}
          <Card className="lg:col-span-2 shadow-xl border-0">
            <CardHeader className="p-8 pb-4">
              <CardTitle className="text-2xl font-bold">Envíanos un mensaje</CardTitle>
            </CardHeader>
            <CardContent className="p-8 pt-0">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">Nombre completo</label>
                    <Input id="name" required placeholder="Tu nombre" className="h-12 bg-muted/50" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">Correo electrónico</label>
                    <Input id="email" type="email" required placeholder="tu@correo.com" className="h-12 bg-muted/50" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium">Asunto</label>
                  <Input id="subject" required placeholder="¿En qué podemos ayudarte?" className="h-12 bg-muted/50" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">Mensaje</label>
                  <Textarea 
                    id="message" 
                    required 
                    placeholder="Escribe tu mensaje aquí..." 
                    className="min-h-[150px] bg-muted/50 resize-y" 
                  />
                </div>
                <Button type="submit" size="lg" className="w-full md:w-auto h-12 px-8">
                  Enviar Mensaje
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Info */}
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
                    <h3 className="font-semibold text-lg mb-1">Dirección</h3>
                    <p className="text-primary-foreground/80">Av. Reforma 1234, CDMX, México</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-primary-foreground/10 p-3 rounded-full mt-1">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Teléfono</h3>
                    <p className="text-primary-foreground/80">+52 (55) 1234-5678</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary-foreground/10 p-3 rounded-full mt-1">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Correo</h3>
                    <p className="text-primary-foreground/80">contacto@rentauto.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary-foreground/10 p-3 rounded-full mt-1">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Horario</h3>
                    <p className="text-primary-foreground/80">Lunes a Viernes: 8:00 - 20:00<br/>Sábados y Domingos: 9:00 - 15:00</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="container mx-auto px-4 py-16">
        <div className="bg-accent/10 border-accent/20 border rounded-2xl p-8 md:p-12 text-center max-w-4xl mx-auto flex flex-col items-center">
          <h2 className="text-3xl font-bold mb-4">¿Necesitas un vehículo urgentemente?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
            Nuestra plataforma te permite reservar en menos de 2 minutos. Verifica nuestra disponibilidad en tiempo real.
          </p>
          <Button asChild size="lg" className="px-10 h-14 text-lg bg-accent hover:bg-accent/90 text-white">
            <Link href="/flota">Reservar Ahora</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
