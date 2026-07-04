import { Vehicle } from "@workspace/api-client-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { getVehicleImages } from "@/lib/vehicle-images";

type VehicleGalleryProps = {
  vehicle: Pick<Vehicle, "name" | "imageUrl" | "imageUrls">;
  className?: string;
  imageClassName?: string;
};

export function VehicleGallery({ vehicle, className, imageClassName }: VehicleGalleryProps) {
  const images = getVehicleImages(vehicle);

  if (!images.length) {
    return (
      <div className={className ?? "relative aspect-video bg-gray-200"}>
        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
          Sin imagen
        </div>
      </div>
    );
  }

  if (images.length === 1) {
    return (
      <div className={className ?? "relative aspect-video bg-gray-200"}>
        <img
          src={images[0]}
          alt={vehicle.name}
          className={imageClassName ?? "w-full h-full object-cover"}
        />
      </div>
    );
  }

  return (
    <div className={className ?? "relative aspect-video bg-gray-200"}>
      <Carousel className="w-full h-full">
        <CarouselContent className="h-full ml-0">
          {images.map((image, index) => (
            <CarouselItem key={`${vehicle.name}-${index}`} className="pl-0 basis-full">
              <img
                src={image}
                alt={`${vehicle.name} ${index + 1}`}
                className={imageClassName ?? "w-full h-full object-cover"}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-3 border-none bg-background/90 shadow-md" />
        <CarouselNext className="right-3 border-none bg-background/90 shadow-md" />
      </Carousel>
      <span className="absolute bottom-3 right-3 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white">
        {images.length} fotos
      </span>
    </div>
  );
}
