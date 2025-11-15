import Image from "next/image";
import { galleryImages } from "@/data/gallery";

export function Gallery() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {galleryImages.map((image, index) => (
        <div key={image} className="relative h-[320px] overflow-hidden rounded-2xl">
          <Image
            src={image}
            alt={`Lizza Atelier creation ${index + 1}`}
            fill
            sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 100vw"
            className="h-full w-full object-cover transition duration-700 hover:scale-105"
          />
        </div>
      ))}
    </div>
  );
}
