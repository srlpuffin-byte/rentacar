import type { VercelRequest, VercelResponse } from "@vercel/node";

export default function handler(_req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (_req.method === "OPTIONS") return res.status(200).end();

  return res.status(200).json({
    totalVehicles: 6,
    activeReservations: 1,
    monthlyRevenue: 375,
    newClients: 12,
    availableVehicles: 4,
    rentedVehicles: 1,
  });
}
