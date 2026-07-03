import { useState, useMemo } from "react";
import { Vehicle } from "@workspace/api-client-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, differenceInDays, addDays, startOfDay } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon, Users, Fuel, Settings, ShieldCheck, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "./cart-context";
import { useCreateReservation, useUpdateVehicle, getListVehiclesQueryKey, getGetStatsQueryKey } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

interface VehicleModalProps {
  vehicle: Vehicle | null;
  isOpen: boolean;
  onClose: () => void;
}

const TRANSMISSION_LABELS: Record<string, string> = {
  automatic: "Automática",
  manual: "Manual",
};

const FUEL_LABELS: Record<string, string> = {
  gasoline: "Gasolina",
  diesel: "Diésel",
  electric: "Eléctrico",
  hybrid: "Híbrido",
};

export function VehicleModal({ vehicle, isOpen, onClose }: VehicleModalProps) {
  const [pickupDate, setPickupDate] = useState<Date | undefined>(startOfDay(addDays(new Date(), 1)));
  const [dropoffDate, setDropoffDate] = useState<Date | undefined>(startOfDay(addDays(new Date(), 4)));
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const { addItem } = useCart();
  const createReservation = useCreateReservation();
  const updateVehicle = useUpdateVehicle();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleClose = () => {
    onClose();
    setClientName("");
    setClientEmail("");
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
    if (!vehicle || !pickupDate || !dropoffDate || !clientName.trim() || !clientEmail.trim()) return;

    const reservationData = {
      vehicleId: vehicle.id,
      clientName: clientName.trim(),
      clientEmail: clientEmail.trim(),
      pickupDate: format(pickupDate, "yyyy-MM-dd"),
      dropoffDate: format(dropoffDate, "yyyy-MM-dd"),
    };

    createReservation.mutate({ data: reservationData }, {
      onSuccess: () => {
        updateVehicle.mutate({ id: vehicle.id, data: { status: "rented" } });

        addItem({
          vehicleId: vehicle.id,
          vehicleName: `${vehicle.brand} ${vehicle.name}`,
          vehicleImageUrl: vehicle.imageUrl,
          pickupDate,
          dropoffDate,
          totalPrice,
        });

        toast({
          title: "Reserva confirmada",
          description: `Tu reserva del ${vehicle.brand} ${vehicle.name} ha sido registrada.`,
        });

        queryClient.invalidateQueries({ queryKey: getListVehiclesQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetStatsQueryKey() });
        handleClose();
      },
      onError: () => {
        toast({
          variant: "destructive",
          title: "Error al reservar",
          description: "No se pudo realizar la reserva. Intenta de nuevo.",
        });
      }
    });
  };

  if (!vehicle) return null;

  const isUnavailable = vehicle.status.toLowerCase() !== "available";
  const isFormValid = clientName.trim() && clientEmail.trim() && pickupDate && dropoffDate;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 max-h-[90vh] overflow-y-auto">
          {/* Imagen e info */}
          <div className="bg-muted flex flex-col">
            <div className="relative aspect-video bg-gray-200">
              {vehicle.imageUrl ? (
                <img src={vehicle.imageUrl} alt={vehicle.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">Sin imagen</div>
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

              <DialogDescription className="mt-2 text-sm">
                {vehicle.description || "Vehículo de alta calidad para tus viajes, con comodidad y seguridad garantizadas."}
              </DialogDescription>

              <div className="grid grid-cols-2 gap-3 mt-5">
                <div className="flex items-center gap-2">
                  <div className="bg-background p-2 rounded-md shadow-sm"><Users className="h-4 w-4 text-primary" /></div>
                  <div><p className="text-xs text-muted-foreground">Pasajeros</p><p className="font-semibold text-sm">{vehicle.seats}</p></div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-background p-2 rounded-md shadow-sm"><Settings className="h-4 w-4 text-primary" /></div>
                  <div><p className="text-xs text-muted-foreground">Transmisión</p><p className="font-semibold text-sm">{TRANSMISSION_LABELS[vehicle.transmission] ?? vehicle.transmission}</p></div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-background p-2 rounded-md shadow-sm"><Fuel className="h-4 w-4 text-primary" /></div>
                  <div><p className="text-xs text-muted-foreground">Combustible</p><p className="font-semibold text-sm">{FUEL_LABELS[vehicle.fuel] ?? vehicle.fuel}</p></div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-background p-2 rounded-md shadow-sm"><ShieldCheck className="h-4 w-4 text-primary" /></div>
                  <div><p className="text-xs text-muted-foreground">Seguro</p><p className="font-semibold text-sm">Completo</p></div>
                </div>
              </div>
            </div>
          </div>

          {/* Formulario de reserva */}
          <div className="p-6 flex flex-col bg-background">
            <h3 className="text-lg font-bold mb-4 border-b pb-2">Detalles de Reserva</h3>

            <div className="space-y-4 flex-1">
              {/* Datos del cliente */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Nombre completo</label>
                <Input
                  placeholder="Tu nombre"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  disabled={isUnavailable}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Correo electrónico</label>
                <Input
                  type="email"
                  placeholder="tu@correo.com"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  disabled={isUnavailable}
                />
              </div>

              {/* Fechas */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Fecha de retiro</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !pickupDate && "text-muted-foreground")} disabled={isUnavailable}>
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
                        if (date && dropoffDate && date >= dropoffDate) setDropoffDate(addDays(date, 1));
                      }}
                      initialFocus
                      disabled={(date) => date < startOfDay(new Date())}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Fecha de entrega</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !dropoffDate && "text-muted-foreground")} disabled={isUnavailable}>
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

              {/* Resumen de precio */}
              <div className="bg-muted p-4 rounded-lg">
                <div className="flex justify-between mb-2 text-sm">
                  <span className="text-muted-foreground">${vehicle.pricePerDay} × {days} {days === 1 ? "día" : "días"}</span>
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

            <div className="pt-4 mt-auto">
              {isUnavailable ? (
                <p className="text-destructive text-sm text-center font-medium py-4 bg-destructive/10 rounded-lg">
                  Este vehículo no está disponible para reservar.
                </p>
              ) : (
                <Button
                  className="w-full py-6 text-base font-semibold"
                  onClick={handleReserve}
                  disabled={createReservation.isPending || !isFormValid}
                >
                  {createReservation.isPending ? "Procesando..." : "Confirmar Reserva"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
