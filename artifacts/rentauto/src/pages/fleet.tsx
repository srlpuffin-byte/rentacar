import { useState, useMemo } from "react";
import { useListVehicles } from "@workspace/api-client-react";
import { VehicleCard } from "@/components/vehicle-card";
import { VehicleModal } from "@/components/vehicle-modal";
import { Vehicle } from "@workspace/api-client-react/src/generated/api.schemas";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Filter, X } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export default function Fleet() {
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  
  // Filter states
  const [categories, setCategories] = useState<string[]>([]);
  const [transmissions, setTransmissions] = useState<string[]>([]);
  const [fuels, setFuelTypes] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(3000);
  const [sortBy, setSortBy] = useState("recommended");

  // We fetch all and filter client side for smooth UI, or pass params.
  // The API supports some params, but we'll fetch all and filter in UI for better UX if the dataset isn't huge.
  // The prompt says "vehicle grid using useListVehicles with filter params", so we'll try to use params where supported.
  
  const queryParams = {
    ...(categories.length === 1 ? { category: categories[0] } : {}),
    ...(transmissions.length === 1 ? { transmission: transmissions[0] } : {}),
    ...(fuels.length === 1 ? { fuel: fuels[0] } : {}),
    maxPrice,
  };

  const { data: allVehicles, isLoading } = useListVehicles();
  const { data: filteredData, isLoading: isFiltering } = useListVehicles(queryParams);

  // Derive filter options from all vehicles
  const filterOptions = useMemo(() => {
    if (!allVehicles) return { categories: [], transmissions: [], fuels: [] };
    
    return {
      categories: Array.from(new Set(allVehicles.map(v => v.category))).sort(),
      transmissions: Array.from(new Set(allVehicles.map(v => v.transmission))).sort(),
      fuels: Array.from(new Set(allVehicles.map(v => v.fuel))).sort(),
    };
  }, [allVehicles]);

  // Client side filtering for multi-select (since API might only support single string param)
  const finalVehicles = useMemo(() => {
    if (!allVehicles) return [];
    
    let filtered = allVehicles.filter(v => {
      if (categories.length > 0 && !categories.includes(v.category)) return false;
      if (transmissions.length > 0 && !transmissions.includes(v.transmission)) return false;
      if (fuels.length > 0 && !fuels.includes(v.fuel)) return false;
      if (v.pricePerDay > maxPrice) return false;
      return true;
    });
    
    // Sort
    if (sortBy === "price_asc") {
      filtered = filtered.sort((a, b) => a.pricePerDay - b.pricePerDay);
    } else if (sortBy === "price_desc") {
      filtered = filtered.sort((a, b) => b.pricePerDay - a.pricePerDay);
    } else if (sortBy === "rating") {
      filtered = filtered.sort((a, b) => b.rating - a.rating);
    }
    
    return filtered;
  }, [allVehicles, categories, transmissions, fuels, maxPrice, sortBy]);

  const handleVehicleClick = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsModalOpen(true);
  };

  const toggleFilter = (stateSetter: React.Dispatch<React.SetStateAction<string[]>>, current: string[], value: string) => {
    if (current.includes(value)) {
      stateSetter(current.filter(item => item !== value));
    } else {
      stateSetter([...current, value]);
    }
  };

  const clearFilters = () => {
    setCategories([]);
    setTransmissions([]);
    setFuelTypes([]);
    setMaxPrice(3000);
  };

  const activeFilterCount = categories.length + transmissions.length + fuels.length + (maxPrice < 3000 ? 1 : 0);

  const FilterSidebar = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-lg">Filtros</h3>
        {activeFilterCount > 0 && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs h-8">
            Limpiar <X className="ml-1 h-3 w-3" />
          </Button>
        )}
      </div>

      <div className="space-y-4">
        <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Categoría</h4>
        <div className="space-y-2">
          {filterOptions.categories.map(cat => (
            <div key={cat} className="flex items-center space-x-2">
              <Checkbox 
                id={`cat-${cat}`} 
                checked={categories.includes(cat)}
                onCheckedChange={() => toggleFilter(setCategories, categories, cat)}
              />
              <label htmlFor={`cat-${cat}`} className="text-sm font-medium leading-none capitalize">
                {cat}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Transmisión</h4>
        <div className="space-y-2">
          {filterOptions.transmissions.map(trans => (
            <div key={trans} className="flex items-center space-x-2">
              <Checkbox 
                id={`trans-${trans}`} 
                checked={transmissions.includes(trans)}
                onCheckedChange={() => toggleFilter(setTransmissions, transmissions, trans)}
              />
              <label htmlFor={`trans-${trans}`} className="text-sm font-medium leading-none capitalize">
                {trans}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Precio Máximo</h4>
          <span className="text-sm font-bold">${maxPrice}</span>
        </div>
        <Slider 
          value={[maxPrice]} 
          min={50} 
          max={3000} 
          step={50} 
          onValueChange={(val) => setMaxPrice(val[0])} 
          className="py-4"
        />
      </div>

      <div className="space-y-4">
        <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Combustible</h4>
        <div className="space-y-2">
          {filterOptions.fuels.map(fuel => (
            <div key={fuel} className="flex items-center space-x-2">
              <Checkbox 
                id={`fuel-${fuel}`} 
                checked={fuels.includes(fuel)}
                onCheckedChange={() => toggleFilter(setFuelTypes, fuels, fuel)}
              />
              <label htmlFor={`fuel-${fuel}`} className="text-sm font-medium leading-none capitalize">
                {fuel}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-background min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Desktop Sidebar */}
          <aside className="hidden md:block w-64 shrink-0">
            <div className="sticky top-24">
              <FilterSidebar />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold">Nuestra Flota</h1>
                <p className="text-muted-foreground">
                  {isLoading ? "Cargando vehículos..." : `${finalVehicles.length} vehículos encontrados`}
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <Sheet open={isMobileFiltersOpen} onOpenChange={setIsMobileFiltersOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="md:hidden relative">
                      <Filter className="mr-2 h-4 w-4" /> Filtros
                      {activeFilterCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs font-bold h-5 w-5 rounded-full flex items-center justify-center">
                          {activeFilterCount}
                        </span>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[300px]">
                    <SheetHeader className="mb-6">
                      <SheetTitle>Filtros</SheetTitle>
                    </SheetHeader>
                    <FilterSidebar />
                  </SheetContent>
                </Sheet>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Ordenar por" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recommended">Recomendados</SelectItem>
                    <SelectItem value="price_asc">Menor precio</SelectItem>
                    <SelectItem value="price_desc">Mayor precio</SelectItem>
                    <SelectItem value="rating">Mejor calificación</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="h-[400px] bg-gray-200 animate-pulse rounded-lg" />
                ))}
              </div>
            ) : finalVehicles.length === 0 ? (
              <div className="text-center py-24 bg-muted/50 rounded-xl border border-dashed">
                <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Filter className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-2">No se encontraron vehículos</h3>
                <p className="text-muted-foreground mb-6">Intenta ajustando los filtros para ver más resultados.</p>
                <Button onClick={clearFilters}>Limpiar todos los filtros</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {finalVehicles.map(vehicle => (
                  <VehicleCard 
                    key={vehicle.id} 
                    vehicle={vehicle} 
                    onClick={handleVehicleClick} 
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <VehicleModal 
        vehicle={selectedVehicle} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
