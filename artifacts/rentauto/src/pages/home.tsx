import { useState } from "react";
import { useListVehicles } from "@workspace/api-client-react";
import { VehicleCard } from "@/components/vehicle-card";
import { VehicleModal } from "@/components/vehicle-modal";
import { Vehicle } from "@workspace/api-client-react/src/generated/api.schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Calendar as CalendarIcon, Search, ShieldCheck, Clock, CheckCircle2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "wouter";

export default function Home() {
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [, setLocation] = useLocation();
  
  const [pickupDate, setPickupDate] = useState<Date>();
  const [dropoffDate, setDropoffDate] = useState<Date>();

  const { data: featuredVehicles, isLoading } = useListVehicles({ featured: true });

  const handleVehicleClick = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsModalOpen(true);
  };

  const handleSearch = () => {
    setLocation("/flota");
  };

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative w-full h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-primary/90 z-10" />
        <div 
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2070&auto=format&fit=crop")' }}
        />
        
        <div className="container relative z-20 px-4 flex flex-col items-center text-center text-white pt-16">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 max-w-4xl">
            Descubre tu próximo destino al volante
          </h1>
          <p className="text-xl md:text-2xl opacity-90 max-w-2xl mb-12">
            La plataforma premium de alquiler de vehículos en América Latina. Confianza, claridad y rapidez en cada reserva.
          </p>

          {/* Search Bar */}
          <div className="w-full max-w-5xl bg-background rounded-xl p-2 shadow-2xl flex flex-col md:flex-row gap-2">
            <div className="flex-1 relative flex items-center">
              <MapPin className="absolute left-4 h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder="Lugar de recogida" 
                className="pl-12 h-14 border-0 focus-visible:ring-0 shadow-none text-foreground text-lg"
              />
            </div>
            
            <div className="hidden md:block w-px bg-border my-2" />
            
            <div className="flex-1 flex gap-2">
              <div className="flex-1">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"ghost"}
                      className={cn(
                        "w-full h-14 justify-start text-left font-normal text-foreground text-lg",
                        !pickupDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-5 w-5" />
                      {pickupDate ? format(pickupDate, "dd MMM", { locale: es }) : <span>Recogida</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={pickupDate}
                      onSelect={setPickupDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="flex-1">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"ghost"}
                      className={cn(
                        "w-full h-14 justify-start text-left font-normal text-foreground text-lg",
                        !dropoffDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-5 w-5" />
                      {dropoffDate ? format(dropoffDate, "dd MMM", { locale: es }) : <span>Entrega</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dropoffDate}
                      onSelect={setDropoffDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <Button onClick={handleSearch} size="lg" className="h-14 px-8 text-lg bg-accent hover:bg-accent/90 text-white">
              <Search className="mr-2 h-5 w-5" /> Buscar
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-primary text-primary-foreground py-8">
        <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 divide-x-0 md:divide-x divide-primary-foreground/20 text-center">
          <div>
            <div className="text-3xl font-bold mb-1">500+</div>
            <div className="text-sm opacity-80 uppercase tracking-wider">Vehículos</div>
          </div>
          <div>
            <div className="text-3xl font-bold mb-1">50k+</div>
            <div className="text-sm opacity-80 uppercase tracking-wider">Clientes</div>
          </div>
          <div>
            <div className="text-3xl font-bold mb-1">25</div>
            <div className="text-sm opacity-80 uppercase tracking-wider">Ciudades</div>
          </div>
          <div>
            <div className="text-3xl font-bold mb-1">4.9</div>
            <div className="text-sm opacity-80 uppercase tracking-wider">Rating</div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">¿Por qué elegir RentAuto?</h2>
            <p className="text-muted-foreground text-lg">Nos esforzamos por brindarte una experiencia sin complicaciones, donde tú eres la prioridad en todo momento.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 bg-accent/10 text-accent rounded-full flex items-center justify-center mb-6">
                <Clock className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">Reserva Instantánea</h3>
              <p className="text-muted-foreground">Sin esperas ni papeleos interminables. Tu vehículo estará listo cuando llegues.</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">Seguro Completo</h3>
              <p className="text-muted-foreground">Viaja con total tranquilidad gracias a nuestra cobertura integral contra todo riesgo.</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 bg-accent/10 text-accent rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">Soporte 24/7</h3>
              <p className="text-muted-foreground">Asistencia en carretera en cualquier momento del día, estés donde estés.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Vehicles */}
      <section className="py-24 bg-muted">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-4">Vehículos Destacados</h2>
              <p className="text-muted-foreground text-lg">Nuestra selección premium para tu próximo viaje</p>
            </div>
            <Button asChild variant="outline" className="hidden md:flex">
              <Link href="/flota">Ver toda la flota</Link>
            </Button>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-[400px] bg-gray-200 animate-pulse rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredVehicles?.map(vehicle => (
                <VehicleCard 
                  key={vehicle.id} 
                  vehicle={vehicle} 
                  onClick={handleVehicleClick} 
                />
              ))}
            </div>
          )}
          
          <div className="mt-10 text-center md:hidden">
            <Button asChild variant="outline" className="w-full">
              <Link href="/flota">Ver toda la flota</Link>
            </Button>
          </div>
        </div>
      </section>

      <VehicleModal 
        vehicle={selectedVehicle} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
