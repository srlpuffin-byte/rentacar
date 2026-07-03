import type { VercelRequest, VercelResponse } from "@vercel/node";

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
    imageUrl: "https://images.unsplash.com/photo-1621007947382-bb3c3968e3bb?w=600",
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
    imageUrl: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600",
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
    imageUrl: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600",
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
    imageUrl: "https://images.unsplash.com/photo-1590362891991-f776e747588e?w=600",
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
    imageUrl: "https://images.unsplash.com/photo-1519641471654-76ce5427a986?w=600",
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
    imageUrl: "https://images.unsplash.com/photo-1584345604470-4d6b948d692b?w=600",
    featured: false,
    description: "Deportivo icónico con potencia y estilo americano.",
  },
];

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  const { category, transmission, fuel, maxPrice, featured } = req.query;

  let result = [...vehicles];
  if (category) result = result.filter((v) => v.category === category);
  if (transmission) result = result.filter((v) => v.transmission === transmission);
  if (fuel) result = result.filter((v) => v.fuel === fuel);
  if (maxPrice) result = result.filter((v) => v.pricePerDay <= Number(maxPrice));
  if (featured === "true") result = result.filter((v) => v.featured);

  return res.status(200).json(result);
}
