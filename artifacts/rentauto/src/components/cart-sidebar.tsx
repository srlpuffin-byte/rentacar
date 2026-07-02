import { useCart } from "./cart-context";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export function CartSidebar() {
  const { items, isCartOpen, setIsCartOpen, removeItem } = useCart();

  const total = items.reduce((acc, item) => acc + item.totalPrice, 0);

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle>Tus Reservas ({items.length})</SheetTitle>
        </SheetHeader>
        
        <div className="flex-1 flex flex-col gap-4 mt-6 overflow-hidden">
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-muted-foreground">
              <p>Tu carrito está vacío</p>
              <p className="text-sm mt-2">Agrega vehículos para comenzar tu reserva</p>
            </div>
          ) : (
            <>
              <ScrollArea className="flex-1 -mx-6 px-6">
                <div className="space-y-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="h-20 w-24 bg-muted rounded-md overflow-hidden shrink-0">
                        {item.vehicleImageUrl ? (
                          <img src={item.vehicleImageUrl} alt={item.vehicleName} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-100">
                            <span className="text-xs text-gray-400">Sin imagen</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{item.vehicleName}</h4>
                        <div className="text-xs text-muted-foreground mt-1 space-y-1">
                          <p>Retiro: {format(item.pickupDate, "PPP", { locale: es })}</p>
                          <p>Entrega: {format(item.dropoffDate, "PPP", { locale: es })}</p>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <p className="font-bold text-primary">${item.totalPrice.toLocaleString()}</p>
                          <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)} className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between font-semibold text-lg mb-4">
                  <span>Total</span>
                  <span>${total.toLocaleString()}</span>
                </div>
                <Button className="w-full">Confirmar Reservas</Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
