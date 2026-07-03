import type { VercelRequest, VercelResponse } from "@vercel/node";

const reservations = [
  {
    id: 1,
    vehicleId: 5,
    vehicleName: "Toyota RAV4",
    vehicleImageUrl: "https://images.unsplash.com/photo-1519641471654-76ce5427a986?w=600",
    clientName: "María García",
    clientEmail: "maria@example.com",
    pickupDate: "2026-07-05",
    dropoffDate: "2026-07-10",
    totalPrice: 375,
    status: "active",
    createdAt: "2026-06-28T10:00:00.000Z",
  },
];

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method === "GET") {
    return res.status(200).json(reservations);
  }

  if (req.method === "POST") {
    // En modo mock simplemente devolvemos una reserva de ejemplo
    const body = req.body as {
      vehicleId: number;
      clientName: string;
      clientEmail: string;
      pickupDate: string;
      dropoffDate: string;
    };
    const newReservation = {
      id: reservations.length + 2,
      vehicleId: body.vehicleId,
      vehicleName: "Vehículo seleccionado",
      vehicleImageUrl: null,
      clientName: body.clientName,
      clientEmail: body.clientEmail,
      pickupDate: body.pickupDate,
      dropoffDate: body.dropoffDate,
      totalPrice: 100,
      status: "active",
      createdAt: new Date().toISOString(),
    };
    return res.status(201).json(newReservation);
  }

  return res.status(405).json({ error: "Method not allowed" });
}
