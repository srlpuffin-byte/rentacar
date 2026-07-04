/**
 * Migration script: Upload legacy base64 images to Cloudinary
 *
 * Usage:
 *   DATABASE_URL=<your-db-url> CLOUDINARY_URL=<your-cloudinary-url> pnpm --filter @workspace/scripts run migrate-images
 *
 * This script:
 *  1. Reads ALL vehicles from the database using a raw SQL query that includes imageUrls
 *  2. For each vehicle, checks if imageUrl or imageUrls contain base64 strings
 *  3. Uploads them to Cloudinary and updates the database record with the new URLs
 */

import pg from "pg";
import { v2 as cloudinary } from "cloudinary";

const { Pool } = pg;

// ─── Validate environment ────────────────────────────────────────────────────

if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL environment variable is required");
  process.exit(1);
}

if (!process.env.CLOUDINARY_URL) {
  console.error("❌ CLOUDINARY_URL environment variable is required");
  process.exit(1);
}

// ─── Setup ───────────────────────────────────────────────────────────────────

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function uploadBase64(base64Str: string, vehicleId: number, index: number): Promise<string> {
  console.log(`   ↑ Uploading image ${index + 1} for vehicle ${vehicleId} to Cloudinary...`);
  const result = await cloudinary.uploader.upload(base64Str, {
    folder: "rentacar",
    public_id: `vehicle_${vehicleId}_img_${index}`,
    overwrite: true,
  });
  console.log(`   ✓ Uploaded → ${result.secure_url}`);
  return result.secure_url;
}

function isBase64(str: unknown): str is string {
  return typeof str === "string" && str.startsWith("data:image/");
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function migrate() {
  console.log("🚀 Starting base64 → Cloudinary migration...\n");

  // Read ALL vehicles including imageUrls (this script runs locally so memory isn't an issue)
  const { rows: vehicles } = await pool.query<{
    id: number;
    image_url: string;
    image_urls: string[] | null;
  }>(`SELECT id, image_url, image_urls FROM vehicles`);

  console.log(`📦 Found ${vehicles.length} vehicles to process\n`);

  let migratedCount = 0;

  for (const vehicle of vehicles) {
    const { id, image_url, image_urls } = vehicle;
    const hasBase64Url = isBase64(image_url);
    const base64Urls = (image_urls ?? []).filter(isBase64);

    if (!hasBase64Url && base64Urls.length === 0) {
      console.log(`✅ Vehicle ${id}: No base64 images — skipping`);
      continue;
    }

    console.log(`🔄 Vehicle ${id}: Processing ${base64Urls.length + (hasBase64Url ? 1 : 0)} base64 image(s)...`);

    try {
      // Build the new imageUrls array — uploading base64 ones, keeping URLs as-is
      const allUrls = image_urls ?? (image_url ? [image_url] : []);
      const newUrls: string[] = [];

      for (let i = 0; i < allUrls.length; i++) {
        const url = allUrls[i];
        if (isBase64(url)) {
          const cloudUrl = await uploadBase64(url, id, i);
          newUrls.push(cloudUrl);
        } else {
          newUrls.push(url);
        }
      }

      // If imageUrl itself is base64 (and wasn't in imageUrls), upload it separately
      let newImageUrl = image_url;
      if (isBase64(image_url) && !allUrls.includes(image_url)) {
        newImageUrl = await uploadBase64(image_url, id, 999);
      } else if (newUrls.length > 0) {
        newImageUrl = newUrls[0]!;
      }

      // Update the database
      await pool.query(
        `UPDATE vehicles SET image_url = $1, image_urls = $2 WHERE id = $3`,
        [newImageUrl, newUrls.length > 0 ? newUrls : null, id]
      );

      console.log(`   💾 Database updated for vehicle ${id}\n`);
      migratedCount++;
    } catch (err) {
      console.error(`   ❌ Failed to migrate vehicle ${id}:`, err);
      console.log("   ⚠️  Skipping this vehicle and continuing...\n");
    }
  }

  await pool.end();
  console.log(`\n🎉 Migration complete! ${migratedCount}/${vehicles.length} vehicles updated.`);
}

migrate().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
