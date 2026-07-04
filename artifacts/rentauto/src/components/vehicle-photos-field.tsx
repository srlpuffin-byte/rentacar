import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { readImageFiles } from "@/lib/vehicle-images";

type VehiclePhotosFieldProps = {
  images: string[];
  onChange: (images: string[]) => void;
  inputId: string;
  label?: string;
};

export function VehiclePhotosField({
  images,
  onChange,
  inputId,
  label = "Fotos del vehículo",
}: VehiclePhotosFieldProps) {
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    const uploaded = await readImageFiles(files);
    onChange([...images, ...uploaded]);
    e.target.value = "";
  };

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3 md:col-span-2">
      <label htmlFor={inputId} className="text-sm font-medium">
        {label}
      </label>
      <Input
        id={inputId}
        type="file"
        accept="image/*"
        multiple
        onChange={handleUpload}
      />
      <p className="text-xs text-muted-foreground">
        Podés seleccionar varias fotos a la vez. La primera será la imagen principal.
      </p>

      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {images.map((image, index) => (
            <div key={`${inputId}-${index}`} className="relative group rounded-lg overflow-hidden border bg-muted">
              <img src={image} alt={`Foto ${index + 1}`} className="w-full aspect-[4/3] object-cover" />
              {index === 0 && (
                <span className="absolute top-2 left-2 rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold uppercase text-white">
                  Principal
                </span>
              )}
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeImage(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
