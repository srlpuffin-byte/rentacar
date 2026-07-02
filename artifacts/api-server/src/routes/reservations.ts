import { Router } from "express";
import { db, reservationsTable, vehiclesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { CreateReservationBody } from "@workspace/api-zod";

const router = Router();

router.get("/reservations", async (req, res) => {
  try {
    const rows = await db.select().from(reservationsTable).orderBy(reservationsTable.createdAt);
    const reservations = rows.map((r) => ({
      ...r,
      totalPrice: Number(r.totalPrice),
      createdAt: r.createdAt.toISOString(),
    }));
    return res.json(reservations);
  } catch (err) {
    req.log.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/reservations", async (req, res) => {
  try {
    const parsed = CreateReservationBody.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid input" });

    const { vehicleId, clientName, clientEmail, pickupDate, dropoffDate } = parsed.data;

    const [vehicle] = await db.select().from(vehiclesTable).where(eq(vehiclesTable.id, vehicleId));
    if (!vehicle) return res.status(404).json({ error: "Vehicle not found" });

    const pickup = new Date(pickupDate);
    const dropoff = new Date(dropoffDate);
    const days = Math.max(1, Math.ceil((dropoff.getTime() - pickup.getTime()) / (1000 * 60 * 60 * 24)));
    const totalPrice = Number(vehicle.pricePerDay) * days;

    const [reservation] = await db.insert(reservationsTable).values({
      vehicleId,
      vehicleName: `${vehicle.brand} ${vehicle.name}`,
      vehicleImageUrl: vehicle.imageUrl,
      clientName,
      clientEmail,
      pickupDate,
      dropoffDate,
      totalPrice: String(totalPrice),
      status: "active",
    }).returning();

    return res.status(201).json({
      ...reservation,
      totalPrice: Number(reservation.totalPrice),
      createdAt: reservation.createdAt.toISOString(),
    });
  } catch (err) {
    req.log.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/reservations/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });
    await db.delete(reservationsTable).where(eq(reservationsTable.id, id));
    return res.status(204).send();
  } catch (err) {
    req.log.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
