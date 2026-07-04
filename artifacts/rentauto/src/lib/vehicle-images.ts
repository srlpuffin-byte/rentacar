type VehicleImagesSource = {
  imageUrl: string;
  imageUrls?: string[] | null;
};

export function getVehicleImages(vehicle: VehicleImagesSource): string[] {
  if (vehicle.imageUrls?.length) {
    return vehicle.imageUrls;
  }
  if (vehicle.imageUrl) {
    return [vehicle.imageUrl];
  }
  return [];
}

export function getVehiclePrimaryImage(vehicle: VehicleImagesSource): string {
  return getVehicleImages(vehicle)[0] ?? "";
}

export function normalizeVehicleImages(input: {
  imageUrl?: string;
  imageUrls?: string[];
}): { imageUrl: string; imageUrls: string[] } {
  const imageUrls =
    input.imageUrls?.filter(Boolean) ??
    (input.imageUrl ? [input.imageUrl] : []);

  return {
    imageUrls,
    imageUrl: imageUrls[0] ?? "",
  };
}

export function readImageFiles(files: FileList | File[]): Promise<string[]> {
  const list = Array.from(files).filter((file) => file.type.startsWith("image/"));

  return Promise.all(
    list.map(
      (file) =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = () => reject(reader.error);
          reader.readAsDataURL(file);
        }),
    ),
  );
}
