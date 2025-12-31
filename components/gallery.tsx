import Image from "next/image";

interface GalleryProps {
  images?: string[];
}

export function Gallery({ images }: GalleryProps) {

  const fallbackImages = [
    "",
  ];
  // const fallbackImages = [
  //   "/images/lizzaa/img-14.png",
  //   "/images/lizzaa/img-15.png",
  //   "/images/lizzaa/img-16.png",
  //   "/images/lizzaa/img-17.png",
  //   "/images/lizzaa/img-18.png",
  //   "/images/lizzaa/img-19.png",
  //   "/images/lizzaa/img-20.png",
  //   "/images/lizzaa/img-21.png",
  //   "/images/lizzaa/img-22.png",
  //   "/images/lizzaa/img-23.png",
  //   "/images/lizzaa/img-24.png",
  //   "/images/lizzaa/img-25.png",
  //   "/images/lizzaa/img-26.png",
  //   "/images/lizzaa/img-27.png",
  //   "/images/lizzaa/img-28.png",
  // ];

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