import Image from "next/image";

interface GalleryProps {
  images?: string[];
}

export function Gallery({ images }: GalleryProps) {

  const fallbackImages = [
    "",
  ];

  const galleryImages = images?.filter((img) => img && img.trim() !== '') || fallbackImages.filter((img) => img && img.trim() !== '');

  if (!galleryImages || galleryImages.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {galleryImages.map((image, index) => (
        <div key={`gallery-image-${index}-${image}`} className="relative h-[320px] overflow-hidden rounded-2xl bg-gray-100">
          <Image
            src={image}
            alt={`Lizza Atelier creation ${index + 1}`}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            quality={100}
            priority={index < 6}
            unoptimized
            className="h-full w-full object-cover transition duration-700 hover:scale-105"
            style={{ imageRendering: 'crisp-edges' }}
          />
        </div>
      ))}
    </div>
  );
}