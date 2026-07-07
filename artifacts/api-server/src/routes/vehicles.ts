import { Router } from "express";
import { db, vehiclesTable } from "@workspace/db";
import { eq, lte, and, type SQL } from "drizzle-orm";
import { ListVehiclesQueryParams, CreateVehicleBody, UpdateVehicleBody } from "@workspace/api-zod";
import { uploadBase64Image } from "../lib/cloudinary";

const router = Router();

router.get("/vehicles", async (req, res) => {
  try {
    const parsed = ListVehiclesQueryParams.safeParse(req.query);
    const params = parsed.success ? parsed.data : {};
    const conditions: SQL[] = [];
    if (params.category) conditions.push(eq(vehiclesTable.category, params.category));
    if (params.transmission) conditions.push(eq(vehiclesTable.transmission, params.transmission));
    if (params.fuel) conditions.push(eq(vehiclesTable.fuel, params.fuel));
    if (params.maxPrice) conditions.push(lte(vehiclesTable.pricePerDay, String(params.maxPrice)));
    if (params.featured !== undefined) conditions.push(eq(vehiclesTable.featured, params.featured));

    const columns = {
      id: vehiclesTable.id,
      name: vehiclesTable.name,
      brand: vehiclesTable.brand,
      category: vehiclesTable.category,
      transmission: vehiclesTable.transmission,
      fuel: vehiclesTable.fuel,
      seats: vehiclesTable.seats,
      pricePerDay: vehiclesTable.pricePerDay,
      status: vehiclesTable.status,
      rating: vehiclesTable.rating,
      imageUrl: vehiclesTable.imageUrl,
      imageUrls: vehiclesTable.imageUrls,
      featured: vehiclesTable.featured,
      description: vehiclesTable.description,
    };

    const rows = conditions.length > 0
      ? await db.select(columns).from(vehiclesTable).where(and(...conditions))
      : await db.select(columns).from(vehiclesTable);

    const vehicles = rows.map((v) => ({
      ...v,
      pricePerDay: Number(v.pricePerDay),
      rating: Number(v.rating),
      imageUrls: (v.imageUrls && v.imageUrls.length > 0) ? v.imageUrls : [v.imageUrl].filter(Boolean),
    }));
    return res.json(vehicles);
  } catch (err) {
    req.log.error(err);
    const message = err instanceof Error ? err.message : String(err);
    return res.status(500).json({ error: "Internal server error", detail: message });
  }
});


router.post("/vehicles", async (req, res) => {
  try {
    // Derive imageUrl from imageUrls[0] if imageUrl not provided directly
    const body = req.body as Record<string, unknown>;
    if (!body.imageUrl && Array.isArray(body.imageUrls) && body.imageUrls.length > 0) {
      body.imageUrl = body.imageUrls[0];
    }

    // Upload base64 images to Cloudinary
    if (typeof body.imageUrl === 'string' && body.imageUrl.startsWith('data:image/')) {
      body.imageUrl = await uploadBase64Image(body.imageUrl);
    }
    if (Array.isArray(body.imageUrls)) {
      body.imageUrls = await Promise.all(body.imageUrls.map(async (url) => {
        if (typeof url === 'string' && url.startsWith('data:image/')) {
          return await uploadBase64Image(url);
        }
        return url;
      }));
    }

    const parsed = CreateVehicleBody.safeParse(body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid input", details: parsed.error.issues });
    const { pricePerDay, ...rest } = parsed.data;
    const [vehicle] = await db.insert(vehiclesTable).values({ ...rest, pricePerDay: String(pricePerDay) }).returning();
    return res.status(201).json({ ...vehicle, pricePerDay: Number(vehicle.pricePerDay), rating: Number(vehicle.rating) });
  } catch (err) {
    req.log.error(err);
    const message = err instanceof Error ? err.message : String(err);
    return res.status(500).json({ error: "Internal server error", detail: message });
  }
});

router.get("/vehicles/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });
    const columns = {
      id: vehiclesTable.id,
      name: vehiclesTable.name,
      brand: vehiclesTable.brand,
      category: vehiclesTable.category,
      transmission: vehiclesTable.transmission,
      fuel: vehiclesTable.fuel,
      seats: vehiclesTable.seats,
      pricePerDay: vehiclesTable.pricePerDay,
      status: vehiclesTable.status,
      rating: vehiclesTable.rating,
      imageUrl: vehiclesTable.imageUrl,
      imageUrls: vehiclesTable.imageUrls,
      featured: vehiclesTable.featured,
      description: vehiclesTable.description,
    };
    const [vehicle] = await db.select(columns).from(vehiclesTable).where(eq(vehiclesTable.id, id));
    if (!vehicle) return res.status(404).json({ error: "Not found" });
    return res.json({
      ...vehicle,
      pricePerDay: Number(vehicle.pricePerDay),
      rating: Number(vehicle.rating),
      imageUrls: (vehicle.imageUrls && vehicle.imageUrls.length > 0) ? vehicle.imageUrls : [vehicle.imageUrl].filter(Boolean),
    });
  } catch (err) {
    req.log.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});


router.patch("/vehicles/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });
    // Derive imageUrl from imageUrls[0] if imageUrl not provided directly
    const body = req.body as Record<string, unknown>;
    if (!body.imageUrl && Array.isArray(body.imageUrls) && body.imageUrls.length > 0) {
      body.imageUrl = body.imageUrls[0];
    }

    // Upload base64 images to Cloudinary
    if (typeof body.imageUrl === 'string' && body.imageUrl.startsWith('data:image/')) {
      body.imageUrl = await uploadBase64Image(body.imageUrl);
    }
    if (Array.isArray(body.imageUrls)) {
      body.imageUrls = await Promise.all(body.imageUrls.map(async (url) => {
        if (typeof url === 'string' && url.startsWith('data:image/')) {
          return await uploadBase64Image(url);
        }
        return url;
      }));
    }

    const parsed = UpdateVehicleBody.safeParse(body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid input", details: parsed.error.issues });
    const { pricePerDay, ...rest } = parsed.data;
    const updateData = pricePerDay !== undefined ? { ...rest, pricePerDay: String(pricePerDay) } : rest;
    const [vehicle] = await db.update(vehiclesTable).set(updateData).where(eq(vehiclesTable.id, id)).returning();
    if (!vehicle) return res.status(404).json({ error: "Not found" });
    return res.json({ ...vehicle, pricePerDay: Number(vehicle.pricePerDay), rating: Number(vehicle.rating) });
  } catch (err) {
    req.log.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/vehicles/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });
    await db.delete(vehiclesTable).where(eq(vehiclesTable.id, id));
    return res.status(204).send();
  } catch (err) {
    req.log.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
