import { Vehicle } from "@workspace/api-client-react/src/generated/api.schemas";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Fuel, Settings, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VehicleCardProps {
  vehicle: Vehicle;
  onClick: (vehicle: Vehicle) => void;
}

export function VehicleCard({ vehicle, onClick }: VehicleCardProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "available":
      case "disponible":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "rented":
      case "alquilado":
        return "bg-amber-100 text-amber-800 hover:bg-amber-100";
      case "maintenance":
      case "mantenimiento":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  const statusLabel = vehicle.status.toLowerCase() === 'available' ? 'Disponible' :
                      vehicle.status.toLowerCase() === 'rented' ? 'Alquilado' :
                      vehicle.status.toLowerCase() === 'maintenance' ? 'Mantenimiento' : vehicle.status;

  return (
    <Card className="overflow-hidden cursor-pointer transition-all hover:shadow-md group flex flex-col h-full" onClick={() => onClick(vehicle)}>
      <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
        {vehicle.imageUrl ? (
          <img 
            src={vehicle.imageUrl} 
            alt={vehicle.name} 
            className="object-cover w-full h-full transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            Sin imagen
          </div>
        )}
        <div className="absolute top-2 left-2 flex flex-col gap-2">
          {vehicle.featured && (
            <Badge className="bg-accent text-accent-foreground hover:bg-accent">Destacado</Badge>
          )}
          <Badge className={getStatusColor(vehicle.status)}>{statusLabel}</Badge>
        </div>
        <div className="absolute bottom-2 right-2 bg-background/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-semibold flex items-center gap-1">
          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
          {vehicle.rating.toFixed(1)}
        </div>
      </div>
      
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{vehicle.brand}</p>
            <h3 className="font-bold text-lg line-clamp-1">{vehicle.name}</h3>
          </div>
          <div className="text-right">
            <span className="font-bold text-lg text-primary">${vehicle.pricePerDay}</span>
            <span className="text-xs text-muted-foreground block">/día</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 pt-0 flex-1">
        <div className="grid grid-cols-2 gap-y-2 text-sm text-muted-foreground mt-4">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{vehicle.seats} pas.</span>
          </div>
          <div className="flex items-center gap-1">
            <Settings className="h-4 w-4" />
            <span className="capitalize">{vehicle.transmission}</span>
          </div>
          <div className="flex items-center gap-1">
            <Fuel className="h-4 w-4" />
            <span className="capitalize">{vehicle.fuel}</span>
          </div>
          <div className="flex items-center gap-1">
            <Car className="h-4 w-4" />
            <span className="capitalize">{vehicle.category}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button className="w-full" variant={vehicle.status.toLowerCase() === 'available' ? 'default' : 'secondary'} disabled={vehicle.status.toLowerCase() !== 'available'}>
          {vehicle.status.toLowerCase() === 'available' ? 'Ver Detalles' : 'No Disponible'}
        </Button>
      </CardFooter>
    </Card>
  );
}

// Temporary icon for category
function Car(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
      <circle cx="7" cy="17" r="2" />
      <path d="M9 17h6" />
      <circle cx="17" cy="17" r="2" />
    </svg>
  );
}
