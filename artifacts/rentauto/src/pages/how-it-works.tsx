import { Search, CalendarDays, CheckCircle, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Busca tu vehículo",
      description: "Explora nuestra amplia flota y elige el vehículo que mejor se adapte a tus necesidades. Usa nuestros filtros avanzados para encontrar exactamente lo que buscas.",
      icon: Search
    },
    {
      number: "02",
      title: "Selecciona fechas",
      description: "Elige las fechas y horas exactas para recoger y entregar el vehículo. Nuestro sistema calculará el mejor precio disponible automáticamente.",
      icon: CalendarDays
    },
    {
      number: "03",
      title: "Confirma tu reserva",
      description: "Revisa los detalles, ingresa tu información personal y confirma. Recibirás un correo electrónico con todos los detalles al instante.",
      icon: CheckCircle
    },
    {
      number: "04",
      title: "Recoge y disfruta",
      description: "Preséntate en nuestra sucursal con tu identificación y reserva. Te entregaremos las llaves en menos de 5 minutos.",
      icon: Car
    }
  ];

  return (
    <div className="bg-background">
      <div className="bg-primary text-primary-foreground py-24">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Cómo Funciona RentAuto</h1>
          <p className="text-xl opacity-90">
            Alquilar un coche nunca ha sido tan fácil. Diseñamos nuestro proceso para que estés al volante en tiempo récord.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-24">
            {steps.map((step, index) => (
              <div key={index} className={`flex flex-col md:flex-row gap-8 items-center ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
                <div className="w-full md:w-1/2 flex justify-center">
                  <div className="relative w-64 h-64 flex items-center justify-center">
                    <div className="absolute inset-0 bg-accent/10 rounded-full scale-150 blur-3xl opacity-50"></div>
                    <div className="relative z-10 w-48 h-48 bg-background border shadow-2xl rounded-2xl flex flex-col items-center justify-center p-6 text-center transform rotate-3 hover:rotate-0 transition-transform duration-500">
                      <step.icon className="h-16 w-16 text-primary mb-4" />
                      <div className="absolute -top-6 -left-6 w-16 h-16 bg-accent text-white font-bold text-2xl flex items-center justify-center rounded-full shadow-lg">
                        {step.number}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="w-full md:w-1/2 text-center md:text-left">
                  <h2 className="text-3xl font-bold mb-4">{step.title}</h2>
                  <p className="text-lg text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="bg-muted py-24 text-center">
        <div className="container mx-auto px-4 max-w-2xl">
          <h2 className="text-3xl font-bold mb-6">¿Listo para comenzar?</h2>
          <p className="text-xl text-muted-foreground mb-10">
            Explora nuestra flota hoy mismo y encuentra el compañero perfecto para tu próxima aventura.
          </p>
          <Button asChild size="lg" className="px-12 py-6 text-lg h-auto">
            <Link href="/flota">Explorar la flota</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
