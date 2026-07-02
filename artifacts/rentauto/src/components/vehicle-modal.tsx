import { useState, useMemo } from "react";
import { Vehicle } from "@workspace/api-client-react/src/generated/api.schemas";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, differenceInDays, addDays, startOfDay } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon, Users, Fuel, Settings, ShieldCheck, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "./cart-context";
import { useCreateReservation, getListVehiclesQueryKey } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

interface VehicleModalProps {
  vehicle: Vehicle | null;
  isOpen: boolean;
  onClose: () => void;
}

export function VehicleModal({ vehicle, isOpen, onClose }: VehicleModalProps) {
  const [pickupDate, setPickupDate] = useState<Date | undefined>(startOfDay(addDays(new Date(), 1)));
  const [dropoffDate, setDropoffDate] = useState<Date | undefined>(startOfDay(addDays(new Date(), 4)));
  const { addItem } = useCart();
  const createReservation = useCreateReservation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleClose = () => {
    onClose();
    // Reset dates on close?
  };

  const days = useMemo(() => {
    if (pickupDate && dropoffDate) {
      const diff = differenceInDays(dropoffDate, pickupDate);
      return diff > 0 ? diff : 1;
    }
    return 0;
  }, [pickupDate, dropoffDate]);

  const totalPrice = vehicle ? days * vehicle.pricePerDay : 0;

  const handleReserve = () => {
    if (!vehicle || !pickupDate || !dropoffDate) return;

    // We add to cart instead of directly calling API per instructions:
    // "Reservar button that calls useCreateReservation and adds to cart"
    // Wait, the prompt says: "Reservar button that calls useCreateReservation and adds to cart"
    // We should probably just call the mutation and then add to cart, or just add to cart and let cart handle checkout?
    // Let's call mutation with a fake client name/email for now, or just add to cart.
    // The instructions: "Reservar" button that calls useCreateReservation and adds to cart
    
    const reservationData = {
      vehicleId: vehicle.id,
      clientName: "Usuario Web", // Placeholder, since form is not specified for modal
      clientEmail: "usuario@ejemplo.com",
      pickupDate: format(pickupDate, "yyyy-MM-dd"),
      dropoffDate: format(dropoffDate, "yyyy-MM-dd"),
    };

    createReservation.mutate({ data: reservationData }, {
      onSuccess: () => {
        addItem({
          vehicleId: vehicle.id,
          vehicleName: vehicle.name,
          vehicleImageUrl: vehicle.imageUrl,
          pickupDate,
          dropoffDate,
          totalPrice,
        });
        
        toast({
          title: "Vehículo agregado",
          description: "Se ha agregado a tus reservas.",
        });
        
        queryClient.invalidateQueries({ queryKey: getListVehiclesQueryKey() });
        handleClose();
      },
      onError: () => {
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudo realizar la reserva. Intenta de nuevo.",
        });
      }
    });
  };

  if (!vehicle) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 max-h-[90vh] overflow-y-auto">
          {/* Image & Info Side */}
          <div className="bg-muted flex flex-col">
            <div className="relative aspect-video bg-gray-200">
              {vehicle.imageUrl ? (
                <img src={vehicle.imageUrl} alt={vehicle.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">Sin imagen</div>
              )}
            </div>
            
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-sm text-muted-foreground uppercase tracking-wider">{vehicle.brand}</p>
                  <DialogTitle className="text-2xl font-bold">{vehicle.name}</DialogTitle>
                </div>
                <div className="bg-background px-2 py-1 rounded text-sm font-semibold flex items-center gap-1 shadow-sm">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  {vehicle.rating.toFixed(1)}
                </div>
              </div>
              
              <DialogDescription className="mt-4">
                {vehicle.description || "Un vehículo excelente para tus viajes, ofreciendo comodidad, seguridad y un rendimiento superior."}
              </DialogDescription>
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="flex items-center gap-2">
                  <div className="bg-background p-2 rounded-md shadow-sm">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Pasajeros</p>
                    <p className="font-semibold text-sm">{vehicle.seats}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-background p-2 rounded-md shadow-sm">
                    <Settings className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Transmisión</p>
                    <p className="font-semibold text-sm capitalize">{vehicle.transmission}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-background p-2 rounded-md shadow-sm">
                    <Fuel className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Combustible</p>
                    <p className="font-semibold text-sm capitalize">{vehicle.fuel}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-background p-2 rounded-md shadow-sm">
                    <ShieldCheck className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Seguro</p>
                    <p className="font-semibold text-sm">Completo</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Booking Side */}
          <div className="p-6 flex flex-col bg-background">
            <h3 className="text-lg font-bold mb-4 border-b pb-2">Detalles de Reserva</h3>
            
            <div className="space-y-4 flex-1">
              <div className="space-y-2">
                <label className="text-sm font-medium">Fecha de Retiro</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !pickupDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {pickupDate ? format(pickupDate, "PPP", { locale: es }) : <span>Seleccionar fecha</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={pickupDate}
                      onSelect={(date) => {
                        setPickupDate(date);
                        if (date && dropoffDate && date > dropoffDate) {
                          setDropoffDate(addDays(date, 1));
                        }
                      }}
                      initialFocus
                      disabled={(date) => date < startOfDay(new Date())}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Fecha de Entrega</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dropoffDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dropoffDate ? format(dropoffDate, "PPP", { locale: es }) : <span>Seleccionar fecha</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dropoffDate}
                      onSelect={setDropoffDate}
                      initialFocus
                      disabled={(date) => pickupDate ? date <= pickupDate : date < startOfDay(new Date())}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="bg-muted p-4 rounded-lg mt-6">
                <div className="flex justify-between mb-2 text-sm">
                  <span className="text-muted-foreground">${vehicle.pricePerDay} x {days} {days === 1 ? 'día' : 'días'}</span>
                  <span>${(vehicle.pricePerDay * days).toLocaleString()}</span>
                </div>
                <div className="flex justify-between mb-2 text-sm">
                  <span className="text-muted-foreground">Impuestos y tarifas</span>
                  <span>Incluidos</span>
                </div>
                <div className="border-t pt-2 mt-2 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-primary">${totalPrice.toLocaleString()}</span>
                </div>
              </div>
            </div>
            
            <div className="pt-6 mt-auto">
              <Button 
                className="w-full py-6 text-lg" 
                onClick={handleReserve}
                disabled={createReservation.isPending || !pickupDate || !dropoffDate || vehicle.status.toLowerCase() !== 'available'}
              >
                {createReservation.isPending ? "Procesando..." : "Reservar Ahora"}
              </Button>
              {vehicle.status.toLowerCase() !== 'available' && (
                <p className="text-red-500 text-sm text-center mt-2 font-medium">Este vehículo no está disponible para reservar actualmente.</p>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
