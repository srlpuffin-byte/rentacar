import { Router } from "express";
import { db, vehiclesTable, reservationsTable } from "@workspace/db";
import { eq, count, sum } from "drizzle-orm";

const router = Router();

router.get("/stats", async (req, res) => {
  try {
    const allVehicles = await db.select({ status: vehiclesTable.status }).from(vehiclesTable);
    const totalVehicles = allVehicles.length;
    const availableVehicles = allVehicles.filter((v) => v.status === "available").length;
    const rentedVehicles = allVehicles.filter((v) => v.status === "rented").length;

    const [reservationStats] = await db
      .select({ active: count(), revenue: sum(reservationsTable.totalPrice) })
      .from(reservationsTable)
      .where(eq(reservationsTable.status, "active"));

    return res.json({
      totalVehicles,
      availableVehicles,
      rentedVehicles,
      activeReservations: reservationStats.active,
      monthlyRevenue: Number(reservationStats.revenue ?? 0),
      newClients: 142,
    });
  } catch (err) {
    req.log.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
