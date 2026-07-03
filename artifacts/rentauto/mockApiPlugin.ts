import type { Plugin } from "vite";

type Vehicle = {
  id: number;
  name: string;
  brand: string;
  category: string;
  transmission: string;
  fuel: string;
  seats: number;
  pricePerDay: number;
  status: string;
  rating: number;
  imageUrl: string;
  featured: boolean;
  description?: string | null;
};

type Reservation = {
  id: number;
  vehicleId: number;
  vehicleName: string;
  vehicleImageUrl?: string | null;
  clientName: string;
  clientEmail: string;
  pickupDate: string;
  dropoffDate: string;
  totalPrice: number;
  status: string;
  createdAt: string;
};

const vehicles: Vehicle[] = [
  {
    id: 1,
    name: "Corolla",
    brand: "Toyota",
    category: "sedan",
    transmission: "automatic",
    fuel: "gasoline",
    seats: 5,
    pricePerDay: 45,
    status: "available",
    rating: 4.8,
    imageUrl:
      "https://images.unsplash.com/photo-1621007947382-bb3c3968e3bb?w=600",
    featured: true,
    description: "Sedán confiable y eficiente, ideal para la ciudad.",
  },
  {
    id: 2,
    name: "X5",
    brand: "BMW",
    category: "suv",
    transmission: "automatic",
    fuel: "diesel",
    seats: 5,
    pricePerDay: 120,
    status: "available",
    rating: 4.9,
    imageUrl:
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600",
    featured: true,
    description: "SUV premium con excelente rendimiento y confort.",
  },
  {
    id: 3,
    name: "Clase C",
    brand: "Mercedes-Benz",
    category: "luxury",
    transmission: "automatic",
    fuel: "gasoline",
    seats: 5,
    pricePerDay: 95,
    status: "available",
    rating: 4.7,
    imageUrl:
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600",
    featured: true,
    description: "Lujo y elegancia para viajes de negocios o placer.",
  },
  {
    id: 4,
    name: "Civic",
    brand: "Honda",
    category: "sedan",
    transmission: "manual",
    fuel: "gasoline",
    seats: 5,
    pricePerDay: 40,
    status: "available",
    rating: 4.6,
    imageUrl:
      "https://images.unsplash.com/photo-1590362891991-f776e747588e?w=600",
    featured: false,
    description: "Compacto ágil con bajo consumo de combustible.",
  },
  {
    id: 5,
    name: "RAV4",
    brand: "Toyota",
    category: "suv",
    transmission: "automatic",
    fuel: "hybrid",
    seats: 5,
    pricePerDay: 75,
    status: "rented",
    rating: 4.8,
    imageUrl:
      "https://images.unsplash.com/photo-1519641471654-76ce5427a986?w=600",
    featured: false,
    description: "SUV híbrido versátil para aventuras urbanas y rurales.",
  },
  {
    id: 6,
    name: "Mustang",
    brand: "Ford",
    category: "sports",
    transmission: "manual",
    fuel: "gasoline",
    seats: 4,
    pricePerDay: 110,
    status: "maintenance",
    rating: 4.9,
    imageUrl:
      "https://images.unsplash.com/photo-1584345604470-4d6b948d692b?w=600",
    featured: false,
    description: "Deportivo icónico con potencia y estilo americano.",
  },
];

let reservations: Reservation[] = [
  {
    id: 1,
    vehicleId: 5,
    vehicleName: "Toyota RAV4",
    vehicleImageUrl: vehicles[4].imageUrl,
    clientName: "María García",
    clientEmail: "maria@example.com",
    pickupDate: "2026-07-05",
    dropoffDate: "2026-07-10",
    totalPrice: 375,
    status: "active",
    createdAt: "2026-06-28T10:00:00.000Z",
  },
];

function parseBody(req: import("http").IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on("error", reject);
  });
}

function filterVehicles(url: URL): Vehicle[] {
  let result = [...vehicles];

  const category = url.searchParams.get("category");
  const transmission = url.searchParams.get("transmission");
  const fuel = url.searchParams.get("fuel");
  const maxPrice = url.searchParams.get("maxPrice");
  const featured = url.searchParams.get("featured");

  if (category) result = result.filter((v) => v.category === category);
  if (transmission)
    result = result.filter((v) => v.transmission === transmission);
  if (fuel) result = result.filter((v) => v.fuel === fuel);
  if (maxPrice)
    result = result.filter((v) => v.pricePerDay <= Number(maxPrice));
  if (featured === "true") result = result.filter((v) => v.featured);

  return result;
}

function getStats() {
  return {
    totalVehicles: vehicles.length,
    activeReservations: reservations.filter((r) => r.status === "active")
      .length,
    monthlyRevenue: reservations.reduce((sum, r) => sum + r.totalPrice, 0),
    newClients: 12,
    availableVehicles: vehicles.filter((v) => v.status === "available").length,
    rentedVehicles: vehicles.filter((v) => v.status === "rented").length,
  };
}

function sendJson(
  res: import("http").ServerResponse,
  status: number,
  body: unknown,
) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(body));
}

export function mockApiPlugin(): Plugin {
  return {
    name: "rentauto-mock-api",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith("/api/")) {
          return next();
        }

        const url = new URL(req.url, "http://localhost");
        const method = req.method ?? "GET";
        const path = url.pathname;

        try {
          if (path === "/api/healthz" && method === "GET") {
            return sendJson(res, 200, { status: "ok" });
          }

          if (path === "/api/stats" && method === "GET") {
            return sendJson(res, 200, getStats());
          }

          if (path === "/api/vehicles" && method === "GET") {
            return sendJson(res, 200, filterVehicles(url));
          }

          if (path === "/api/vehicles" && method === "POST") {
            const body = (await parseBody(req)) as Omit<Vehicle, "id">;
            const vehicle: Vehicle = {
              id: Math.max(0, ...vehicles.map((v) => v.id)) + 1,
              status: "available",
              rating: 4.5,
              featured: false,
              ...body,
            };
            vehicles.push(vehicle);
            return sendJson(res, 201, vehicle);
          }

          const vehicleMatch = path.match(/^\/api\/vehicles\/(\d+)$/);
          if (vehicleMatch) {
            const id = Number(vehicleMatch[1]);
            const index = vehicles.findIndex((v) => v.id === id);

            if (method === "GET") {
              if (index === -1) return sendJson(res, 404, { error: "Not found" });
              return sendJson(res, 200, vehicles[index]);
            }

            if (method === "PATCH") {
              if (index === -1) return sendJson(res, 404, { error: "Not found" });
              const body = (await parseBody(req)) as Partial<Vehicle>;
              vehicles[index] = { ...vehicles[index], ...body };
              return sendJson(res, 200, vehicles[index]);
            }

            if (method === "DELETE") {
              if (index === -1) return sendJson(res, 404, { error: "Not found" });
              vehicles.splice(index, 1);
              res.statusCode = 204;
              return res.end();
            }
          }

          if (path === "/api/reservations" && method === "GET") {
            return sendJson(res, 200, reservations);
          }

          if (path === "/api/reservations" && method === "POST") {
            const body = (await parseBody(req)) as Omit<
              Reservation,
              "id" | "vehicleName" | "vehicleImageUrl" | "totalPrice" | "status" | "createdAt"
            > & { vehicleId: number };
            const vehicle = vehicles.find((v) => v.id === body.vehicleId);
            if (!vehicle) return sendJson(res, 400, { error: "Vehicle not found" });

            const pickup = new Date(body.pickupDate);
            const dropoff = new Date(body.dropoffDate);
            const days = Math.max(
              1,
              Math.ceil(
                (dropoff.getTime() - pickup.getTime()) / (1000 * 60 * 60 * 24),
              ),
            );

            const reservation: Reservation = {
              id: Math.max(0, ...reservations.map((r) => r.id)) + 1,
              vehicleId: body.vehicleId,
              vehicleName: `${vehicle.brand} ${vehicle.name}`,
              vehicleImageUrl: vehicle.imageUrl,
              clientName: body.clientName,
              clientEmail: body.clientEmail,
              pickupDate: body.pickupDate,
              dropoffDate: body.dropoffDate,
              totalPrice: days * vehicle.pricePerDay,
              status: "active",
              createdAt: new Date().toISOString(),
            };
            reservations.push(reservation);
            return sendJson(res, 201, reservation);
          }

          const reservationMatch = path.match(/^\/api\/reservations\/(\d+)$/);
          if (reservationMatch && method === "DELETE") {
            const id = Number(reservationMatch[1]);
            const index = reservations.findIndex((r) => r.id === id);
            if (index === -1) return sendJson(res, 404, { error: "Not found" });
            reservations.splice(index, 1);
            res.statusCode = 204;
            return res.end();
          }

          return sendJson(res, 404, { error: "Not found" });
        } catch {
          return sendJson(res, 500, { error: "Internal server error" });
        }
      });
    },
  };
}
