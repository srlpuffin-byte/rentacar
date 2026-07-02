import { useState } from "react";
import { 
  useGetStats, 
  useListVehicles, 
  useListReservations,
  useCreateVehicle,
  useDeleteVehicle,
  useDeleteReservation,
  getListVehiclesQueryKey,
  getListReservationsQueryKey,
  getGetStatsQueryKey
} from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Car, CalendarCheck, TrendingUp, Users, Plus, Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function Admin() {
  const { data: stats, isLoading: isLoadingStats } = useGetStats();
  const { data: vehicles, isLoading: isLoadingVehicles } = useListVehicles();
  const { data: reservations, isLoading: isLoadingReservations } = useListReservations();
  
  const createVehicle = useCreateVehicle();
  const deleteVehicle = useDeleteVehicle();
  const deleteReservation = useDeleteReservation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleDeleteVehicle = (id: number) => {
    if (confirm("¿Estás seguro de eliminar este vehículo?")) {
      deleteVehicle.mutate({ id }, {
        onSuccess: () => {
          toast({ title: "Vehículo eliminado" });
          queryClient.invalidateQueries({ queryKey: getListVehiclesQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetStatsQueryKey() });
        }
      });
    }
  };

  const handleDeleteReservation = (id: number) => {
    if (confirm("¿Estás seguro de cancelar esta reserva?")) {
      deleteReservation.mutate({ id }, {
        onSuccess: () => {
          toast({ title: "Reserva cancelada" });
          queryClient.invalidateQueries({ queryKey: getListReservationsQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetStatsQueryKey() });
        }
      });
    }
  };

  // Create Vehicle Form State
  const [newVehicle, setNewVehicle] = useState({
    name: "", brand: "", category: "Sedán", transmission: "Automática", 
    fuel: "Gasolina", seats: 5, pricePerDay: 50, status: "available", 
    imageUrl: "", featured: false, description: ""
  });

  const handleCreateVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    createVehicle.mutate({ data: newVehicle }, {
      onSuccess: () => {
        toast({ title: "Vehículo creado exitosamente" });
        setNewVehicle({
          name: "", brand: "", category: "Sedán", transmission: "Automática", 
          fuel: "Gasolina", seats: 5, pricePerDay: 50, status: "available", 
          imageUrl: "", featured: false, description: ""
        });
        queryClient.invalidateQueries({ queryKey: getListVehiclesQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetStatsQueryKey() });
      }
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Panel de Administración</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Vehículos</CardTitle>
            <Car className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalVehicles || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-green-500 font-medium">{stats?.availableVehicles || 0} disponibles</span>
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Reservas Activas</CardTitle>
            <CalendarCheck className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.activeReservations || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              En este momento
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Ingresos del Mes</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats?.monthlyRevenue?.toLocaleString() || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              USD estimados
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Nuevos Clientes</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.newClients || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Este mes
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="vehicles" className="w-full">
        <TabsList className="mb-6 bg-muted h-12 w-full justify-start p-1 rounded-xl">
          <TabsTrigger value="vehicles" className="rounded-lg text-sm px-6 h-10 data-[state=active]:bg-background data-[state=active]:shadow-sm">Vehículos</TabsTrigger>
          <TabsTrigger value="reservations" className="rounded-lg text-sm px-6 h-10 data-[state=active]:bg-background data-[state=active]:shadow-sm">Reservas</TabsTrigger>
          <TabsTrigger value="add-vehicle" className="rounded-lg text-sm px-6 h-10 data-[state=active]:bg-background data-[state=active]:shadow-sm">Agregar Vehículo</TabsTrigger>
        </TabsList>
        
        <TabsContent value="vehicles" className="mt-0">
          <Card className="border-0 shadow-lg">
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
                        <TableHead className="w-16">ID</TableHead>
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
                          <TableCell className="font-mono text-muted-foreground">{vehicle.id}</TableCell>
                          <TableCell className="font-medium">{vehicle.brand} {vehicle.name}</TableCell>
                          <TableCell className="capitalize">{vehicle.category}</TableCell>
                          <TableCell>${vehicle.pricePerDay}</TableCell>
                          <TableCell>
                            <Badge variant={vehicle.status === 'available' ? 'default' : vehicle.status === 'rented' ? 'secondary' : 'destructive'} className={
                              vehicle.status === 'available' ? 'bg-green-100 text-green-800 hover:bg-green-100' :
                              vehicle.status === 'rented' ? 'bg-amber-100 text-amber-800 hover:bg-amber-100' :
                              'bg-red-100 text-red-800 hover:bg-red-100'
                            }>
                              {vehicle.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteVehicle(vehicle.id)} className="text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reservations" className="mt-0">
          <Card className="border-0 shadow-lg">
            <CardHeader className="border-b bg-muted/20">
              <CardTitle>Reservas Activas e Historial</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {isLoadingReservations ? (
                <div className="p-8 text-center text-muted-foreground">Cargando reservas...</div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-16">ID</TableHead>
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
                          <TableCell className="font-mono text-muted-foreground">{res.id}</TableCell>
                          <TableCell>
                            <div className="font-medium">{res.clientName}</div>
                            <div className="text-xs text-muted-foreground">{res.clientEmail}</div>
                          </TableCell>
                          <TableCell>{res.vehicleName}</TableCell>
                          <TableCell className="text-sm">
                            {format(new Date(res.pickupDate), "dd/MM/yy")} - {format(new Date(res.dropoffDate), "dd/MM/yy")}
                          </TableCell>
                          <TableCell className="font-bold">${res.totalPrice}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={
                              res.status === 'active' ? 'bg-blue-100 text-blue-800' :
                              res.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                              'bg-red-100 text-red-800'
                            }>
                              {res.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteReservation(res.id)} className="text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="add-vehicle" className="mt-0">
          <Card className="border-0 shadow-lg max-w-3xl mx-auto">
            <CardHeader className="border-b bg-muted/20">
              <CardTitle>Agregar Nuevo Vehículo</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleCreateVehicle} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Marca</label>
                    <Input required value={newVehicle.brand} onChange={e => setNewVehicle({...newVehicle, brand: e.target.value})} placeholder="Ej. Toyota" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Modelo</label>
                    <Input required value={newVehicle.name} onChange={e => setNewVehicle({...newVehicle, name: e.target.value})} placeholder="Ej. Corolla" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Categoría</label>
                    <select 
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={newVehicle.category} 
                      onChange={e => setNewVehicle({...newVehicle, category: e.target.value})}
                    >
                      <option value="Sedán">Sedán</option>
                      <option value="SUV">SUV</option>
                      <option value="Deportivo">Deportivo</option>
                      <option value="Hatchback">Hatchback</option>
                      <option value="Pickup">Pickup</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Precio por Día ($)</label>
                    <Input required type="number" min="1" value={newVehicle.pricePerDay} onChange={e => setNewVehicle({...newVehicle, pricePerDay: Number(e.target.value)})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Transmisión</label>
                    <select 
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={newVehicle.transmission} 
                      onChange={e => setNewVehicle({...newVehicle, transmission: e.target.value})}
                    >
                      <option value="Automática">Automática</option>
                      <option value="Manual">Manual</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Combustible</label>
                    <select 
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={newVehicle.fuel} 
                      onChange={e => setNewVehicle({...newVehicle, fuel: e.target.value})}
                    >
                      <option value="Gasolina">Gasolina</option>
                      <option value="Diesel">Diesel</option>
                      <option value="Híbrido">Híbrido</option>
                      <option value="Eléctrico">Eléctrico</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Asientos</label>
                    <Input required type="number" min="1" max="15" value={newVehicle.seats} onChange={e => setNewVehicle({...newVehicle, seats: Number(e.target.value)})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">URL de Imagen</label>
                    <Input required type="url" value={newVehicle.imageUrl} onChange={e => setNewVehicle({...newVehicle, imageUrl: e.target.value})} placeholder="https://..." />
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 pt-2">
                  <input 
                    type="checkbox" 
                    id="featured" 
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    checked={newVehicle.featured} 
                    onChange={e => setNewVehicle({...newVehicle, featured: e.target.checked})} 
                  />
                  <label htmlFor="featured" className="text-sm font-medium">
                    Mostrar en destacados de la página principal
                  </label>
                </div>
                
                <div className="pt-4 flex justify-end">
                  <Button type="submit" disabled={createVehicle.isPending}>
                    {createVehicle.isPending ? "Guardando..." : "Guardar Vehículo"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
