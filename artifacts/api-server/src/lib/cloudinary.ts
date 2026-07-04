import { v2 as cloudinary } from "cloudinary";

// Cloudinary config is automatically loaded from the CLOUDINARY_URL environment variable.
// Make sure this variable is set in the environment before starting the server.

/**
 * Uploads a base64 encoded image to Cloudinary and returns the secure URL.
 * 
 * @param base64Str The base64 string of the image (e.g. data:image/jpeg;base64,/9j...)
 * @returns The secure URL of the uploaded image
 */
export async function uploadBase64Image(base64Str: string): Promise<string> {
  try {
    const result = await cloudinary.uploader.upload(base64Str, {
      folder: "rentacar",
    });
    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary upload failed:", error);
    throw new Error("Failed to upload image to Cloudinary");
  }
}
