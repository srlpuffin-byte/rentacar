import { useState } from "react";
import {
  useGetStats,
  useListVehicles,
  useListReservations,
  useCreateVehicle,
  useDeleteVehicle,
  useDeleteReservation,
  useUpdateVehicle,
  getListVehiclesQueryKey,
  getListReservationsQueryKey,
  getGetStatsQueryKey,
} from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Car, CalendarCheck, TrendingUp, Users, Trash2, Pencil } from "lucide-react";
import { VehiclePhotosField } from "@/components/vehicle-photos-field";
import { normalizeVehicleImages } from "@/lib/vehicle-images";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";

const STATUS_LABELS: Record<string, string> = {
  available: "Disponible",
  rented: "Alquilado",
  maintenance: "Mantenimiento",
};

const STATUS_CLASSES: Record<string, string> = {
  available: "bg-green-100 text-green-800 hover:bg-green-100",
  rented: "bg-amber-100 text-amber-800 hover:bg-amber-100",
  maintenance: "bg-red-100 text-red-800 hover:bg-red-100",
};

const RESERVATION_STATUS_LABELS: Record<string, string> = {
  active: "Activa",
  completed: "Completada",
  cancelled: "Cancelada",
};

const RESERVATION_STATUS_CLASSES: Record<string, string> = {
  active: "bg-blue-100 text-blue-800",
  completed: "bg-gray-100 text-gray-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function Admin() {
  const { data: stats } = useGetStats();
  const { data: vehicles, isLoading: isLoadingVehicles } = useListVehicles();
  const { data: reservations, isLoading: isLoadingReservations } = useListReservations();

  const createVehicle = useCreateVehicle();
  const deleteVehicle = useDeleteVehicle();
  const deleteReservation = useDeleteReservation();
  const updateVehicle = useUpdateVehicle();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [newVehicle, setNewVehicle] = useState({
    name: "",
    brand: "",
    category: "Económico",
    transmission: "automatic",
    fuel: "gasoline",
    seats: 5,
    pricePerDay: 50,
    status: "available",
    featured: false,
    description: "",
  });
  const [vehicleImages, setVehicleImages] = useState<string[]>([]);
  const [editingVehicle, setEditingVehicle] = useState<any>(null);
  const [editVehicleImages, setEditVehicleImages] = useState<string[]>([]);
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // En un entorno real esto debería validarse en el backend
    if (password === import.meta.env.VITE_ADMIN_PASSWORD || password === "admin123") {
      setIsAuthenticated(true);
    } else {
      toast({ variant: "destructive", title: "Contraseña incorrecta" });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-md">
        <Card className="border shadow-sm">
          <CardHeader className="text-center pb-2">
            <CardTitle>Acceso Administrativo</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Contraseña</label>
                <Input 
                  type="password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  required 
                  autoFocus
                />
              </div>
              <Button type="submit" className="w-full">Ingresar</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: getListVehiclesQueryKey() });
    queryClient.invalidateQueries({ queryKey: getGetStatsQueryKey() });
  };

  const handleDeleteVehicle = (id: number, name: string) => {
    if (!confirm(`¿Eliminar "${name}"? Esta acción no se puede deshacer.`)) return;
    deleteVehicle.mutate({ id }, {
      onSuccess: () => {
        toast({ title: "Vehículo eliminado" });
        invalidateAll();
      },
    });
  };

  const handleStatusChange = (id: number, newStatus: string) => {
    updateVehicle.mutate({ id, data: { status: newStatus } }, {
      onSuccess: () => {
        toast({ title: "Estado actualizado" });
        invalidateAll();
      },
    });
  };

  const handleDeleteReservation = (id: number) => {
    if (!confirm("¿Cancelar esta reserva?")) return;
    deleteReservation.mutate({ id }, {
      onSuccess: () => {
        toast({ title: "Reserva cancelada" });
        queryClient.invalidateQueries({ queryKey: getListReservationsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetStatsQueryKey() });
      },
    });
  };



  const handleCreateVehicle = (e: React.FormEvent) => {
    e.preventDefault();

    const images = normalizeVehicleImages({ imageUrls: vehicleImages });
    if (!images.imageUrl) {
      toast({
        variant: "destructive",
        title: "Foto requerida",
        description: "Agregá al menos una foto del vehículo.",
      });
      return;
    }

    createVehicle.mutate({ data: { ...newVehicle, ...images } }, {
      onSuccess: () => {
        toast({ title: "Vehículo agregado a la flota" });
        setNewVehicle({
          name: "",
          brand: "",
          category: "Económico",
          transmission: "automatic",
          fuel: "gasoline",
          seats: 5,
          pricePerDay: 50,
          status: "available",
          featured: false,
          description: "",
        });
        setVehicleImages([]);
        invalidateAll();
      },
      onError: () => {
        toast({ variant: "destructive", title: "Error", description: "No se pudo agregar el vehículo." });
      },
    });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVehicle) return;

    const images = normalizeVehicleImages({ imageUrls: editVehicleImages });
    if (!images.imageUrl) {
      toast({
        variant: "destructive",
        title: "Foto requerida",
        description: "Agregá al menos una foto del vehículo.",
      });
      return;
    }

    updateVehicle.mutate({ 
      id: editingVehicle.id, 
      data: { ...editingVehicle, ...images } 
    }, {
      onSuccess: () => {
        toast({ title: "Vehículo actualizado" });
        setEditingVehicle(null);
        invalidateAll();
      },
      onError: () => {
        toast({ variant: "destructive", title: "Error", description: "No se pudo actualizar el vehículo." });
      },
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Panel de Administración</h1>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Vehículos</CardTitle>
            <Car className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.totalVehicles ?? 0}</div>
            <p className="text-xs text-green-600 font-medium mt-1">{stats?.availableVehicles ?? 0} disponibles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Reservas Activas</CardTitle>
            <CalendarCheck className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.activeReservations ?? 0}</div>
            <p className="text-xs text-muted-foreground mt-1">{stats?.rentedVehicles ?? 0} vehículos alquilados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Ingresos del Mes</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${(stats?.monthlyRevenue ?? 0).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">USD en reservas activas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Nuevos Clientes</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.newClients ?? 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Este mes</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="vehicles" className="w-full">
        <TabsList className="mb-6 bg-muted h-12 w-full justify-start p-1 rounded-xl">
          <TabsTrigger value="vehicles" className="rounded-lg text-sm px-6 h-10 data-[state=active]:bg-background data-[state=active]:shadow-sm">Vehículos</TabsTrigger>
          <TabsTrigger value="reservations" className="rounded-lg text-sm px-6 h-10 data-[state=active]:bg-background data-[state=active]:shadow-sm">Reservas</TabsTrigger>
          <TabsTrigger value="add-vehicle" className="rounded-lg text-sm px-6 h-10 data-[state=active]:bg-background data-[state=active]:shadow-sm">Agregar Vehículo</TabsTrigger>
        </TabsList>

        {/* Tab: Vehículos */}
        <TabsContent value="vehicles" className="mt-0">
          <Card className="border shadow-sm">
            <CardHeader className="border-b bg-muted/20">
              <CardTitle>Gestión de Flota</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {isLoadingVehicles ? (
                <div className="p-8 text-center text-muted-foreground">Cargando vehículos...</div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">ID</TableHead>
                        <TableHead>Vehículo</TableHead>
                        <TableHead>Categoría</TableHead>
                        <TableHead>Precio/Día</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {vehicles?.map((vehicle) => (
                        <TableRow key={vehicle.id}>
                          <TableCell className="font-mono text-muted-foreground text-xs">{vehicle.id}</TableCell>
                          <TableCell className="font-medium">{vehicle.brand} {vehicle.name}</TableCell>
                          <TableCell>{vehicle.category}</TableCell>
                          <TableCell className="font-semibold">${vehicle.pricePerDay}/día</TableCell>
                          <TableCell>
                            <Select
                              value={vehicle.status}
                              onValueChange={(val) => handleStatusChange(vehicle.id, val)}
                            >
                              <SelectTrigger className="w-36 h-8 text-xs">
                                <SelectValue>
                                  <Badge className={cn("text-xs", STATUS_CLASSES[vehicle.status] ?? "bg-gray-100 text-gray-800")}>
                                    {STATUS_LABELS[vehicle.status] ?? vehicle.status}
                                  </Badge>
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="available">Disponible</SelectItem>
                                <SelectItem value="rented">Alquilado</SelectItem>
                                <SelectItem value="maintenance">Mantenimiento</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell className="text-right whitespace-nowrap">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setEditingVehicle(vehicle);
                                setEditVehicleImages(vehicle.imageUrls || (vehicle.imageUrl ? [vehicle.imageUrl] : []));
                              }}
                              className="text-primary hover:text-primary mr-1"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteVehicle(vehicle.id, `${vehicle.brand} ${vehicle.name}`)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      {!vehicles?.length && (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                            No hay vehículos en la flota.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Reservas */}
        <TabsContent value="reservations" className="mt-0">
          <Card className="border shadow-sm">
            <CardHeader className="border-b bg-muted/20">
              <CardTitle>Reservas</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {isLoadingReservations ? (
                <div className="p-8 text-center text-muted-foreground">Cargando reservas...</div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">ID</TableHead>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Vehículo</TableHead>
                        <TableHead>Fechas</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reservations?.map((res) => (
                        <TableRow key={res.id}>
                          <TableCell className="font-mono text-muted-foreground text-xs">{res.id}</TableCell>
                          <TableCell>
                            <div className="font-medium">{res.clientName}</div>
                            <div className="text-xs text-muted-foreground">{res.clientEmail}</div>
                          </TableCell>
                          <TableCell>{res.vehicleName}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {format(new Date(res.pickupDate + "T12:00:00"), "dd/MM/yyyy")} →{" "}
                            {format(new Date(res.dropoffDate + "T12:00:00"), "dd/MM/yyyy")}
                          </TableCell>
                          <TableCell className="font-bold">${res.totalPrice.toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge className={RESERVATION_STATUS_CLASSES[res.status] ?? "bg-gray-100 text-gray-800"}>
                              {RESERVATION_STATUS_LABELS[res.status] ?? res.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteReservation(res.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      {!reservations?.length && (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                            No hay reservas registradas.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Agregar vehículo */}
        <TabsContent value="add-vehicle" className="mt-0">
          <Card className="border shadow-sm max-w-3xl mx-auto">
            <CardHeader className="border-b bg-muted/20">
              <CardTitle>Agregar Nuevo Vehículo</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleCreateVehicle} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Marca</label>
                    <Input required placeholder="Ej. Toyota" value={newVehicle.brand} onChange={e => setNewVehicle({ ...newVehicle, brand: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Modelo</label>
                    <Input required placeholder="Ej. Corolla" value={newVehicle.name} onChange={e => setNewVehicle({ ...newVehicle, name: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Categoría</label>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      value={newVehicle.category}
                      onChange={e => setNewVehicle({ ...newVehicle, category: e.target.value })}
                    >
                      <option value="Económico">Económico</option>
                      <option value="Compacto">Compacto</option>
                      <option value="SUV">SUV</option>
                      <option value="Lujo">Lujo</option>
                      <option value="Deportivo">Deportivo</option>
                      <option value="Van">Van</option>
                      <option value="Eléctrico">Eléctrico</option>
                      <option value="Pick-up">Pick-up</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Precio por día ($)</label>
                    <Input required type="number" min="1" value={newVehicle.pricePerDay} onChange={e => setNewVehicle({ ...newVehicle, pricePerDay: Number(e.target.value) })} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Transmisión</label>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      value={newVehicle.transmission}
                      onChange={e => setNewVehicle({ ...newVehicle, transmission: e.target.value })}
                    >
                      <option value="automatic">Automática</option>
                      <option value="manual">Manual</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Combustible</label>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      value={newVehicle.fuel}
                      onChange={e => setNewVehicle({ ...newVehicle, fuel: e.target.value })}
                    >
                      <option value="gasoline">Gasolina</option>
                      <option value="diesel">Diésel</option>
                      <option value="hybrid">Híbrido</option>
                      <option value="electric">Eléctrico</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Asientos</label>
                    <Input required type="number" min="1" max="15" value={newVehicle.seats} onChange={e => setNewVehicle({ ...newVehicle, seats: Number(e.target.value) })} />
                  </div>
                  <VehiclePhotosField
                    images={vehicleImages}
                    onChange={setVehicleImages}
                    inputId="new-vehicle-photos"
                  />
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium">Descripción</label>
                    <Input placeholder="Breve descripción del vehículo" value={newVehicle.description} onChange={e => setNewVehicle({ ...newVehicle, description: e.target.value })} />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="featured"
                    className="h-4 w-4 rounded border-gray-300 accent-primary"
                    checked={newVehicle.featured}
                    onChange={e => setNewVehicle({ ...newVehicle, featured: e.target.checked })}
                  />
                  <label htmlFor="featured" className="text-sm font-medium cursor-pointer">
                    Mostrar en destacados de la página principal
                  </label>
                </div>

                <div className="flex justify-end pt-2">
                  <Button type="submit" disabled={createVehicle.isPending} className="px-8">
                    {createVehicle.isPending ? "Guardando..." : "Agregar a la flota"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={!!editingVehicle} onOpenChange={(open) => !open && setEditingVehicle(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Vehículo</DialogTitle>
          </DialogHeader>
          {editingVehicle && (
            <form onSubmit={handleEditSubmit} className="space-y-6 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Marca</label>
                  <Input required value={editingVehicle.brand} onChange={e => setEditingVehicle({ ...editingVehicle, brand: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Modelo</label>
                  <Input required value={editingVehicle.name} onChange={e => setEditingVehicle({ ...editingVehicle, name: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Categoría</label>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    value={editingVehicle.category}
                    onChange={e => setEditingVehicle({ ...editingVehicle, category: e.target.value })}
                  >
                    <option value="Económico">Económico</option>
                    <option value="Compacto">Compacto</option>
                    <option value="SUV">SUV</option>
                    <option value="Lujo">Lujo</option>
                    <option value="Deportivo">Deportivo</option>
                    <option value="Van">Van</option>
                    <option value="Eléctrico">Eléctrico</option>
                    <option value="Pick-up">Pick-up</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Precio por día ($)</label>
                  <Input required type="number" min="1" value={editingVehicle.pricePerDay} onChange={e => setEditingVehicle({ ...editingVehicle, pricePerDay: Number(e.target.value) })} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Transmisión</label>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    value={editingVehicle.transmission}
                    onChange={e => setEditingVehicle({ ...editingVehicle, transmission: e.target.value })}
                  >
                    <option value="automatic">Automática</option>
                    <option value="manual">Manual</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Combustible</label>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    value={editingVehicle.fuel}
                    onChange={e => setEditingVehicle({ ...editingVehicle, fuel: e.target.value })}
                  >
                    <option value="gasoline">Gasolina</option>
                    <option value="diesel">Diésel</option>
                    <option value="hybrid">Híbrido</option>
                    <option value="electric">Eléctrico</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Asientos</label>
                  <Input required type="number" min="1" max="15" value={editingVehicle.seats} onChange={e => setEditingVehicle({ ...editingVehicle, seats: Number(e.target.value) })} />
                </div>
                <VehiclePhotosField
                  images={editVehicleImages}
                  onChange={setEditVehicleImages}
                  inputId="edit-vehicle-photos"
                />
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium">Descripción</label>
                  <Input placeholder="Breve descripción del vehículo" value={editingVehicle.description || ""} onChange={e => setEditingVehicle({ ...editingVehicle, description: e.target.value })} />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="edit-featured"
                  className="h-4 w-4 rounded border-gray-300 accent-primary"
                  checked={editingVehicle.featured || false}
                  onChange={e => setEditingVehicle({ ...editingVehicle, featured: e.target.checked })}
                />
                <label htmlFor="edit-featured" className="text-sm font-medium cursor-pointer">
                  Mostrar en destacados de la página principal
                </label>
              </div>

              <div className="flex justify-end pt-4 gap-2">
                <Button type="button" variant="outline" onClick={() => setEditingVehicle(null)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={updateVehicle.isPending}>
                  {updateVehicle.isPending ? "Guardando..." : "Guardar cambios"}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}
