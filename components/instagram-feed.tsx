import Link from "next/link";
import Image from "next/image";

interface InstagramFeedProps {
  handle: string;
}

export function InstagramFeed({ handle }: InstagramFeedProps) {
  const placeholders = Array.from({ length: 9 });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm uppercase tracking-[0.3em] text-charcoal/60">Follow {handle}</p>
        <Link href="https://www.instagram.com/lizza.atelier" className="text-sm text-charcoal transition hover:opacity-70">
          View Instagram
        </Link>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {placeholders.map((_, index) => (
          <Link
            key={index}
            href="https://www.instagram.com/lizza.atelier"
            className="group relative aspect-square overflow-hidden rounded-2xl bg-charcoal/5"
          >
            <Image
              src={`/images/gallery/img-${(index % 9) + 1}.jpg`}
              alt={`${handle} look ${index + 1}`}
              fill
              sizes="(min-width: 1024px) 10vw, (min-width: 768px) 15vw, 33vw"
              className="object-cover transition duration-500 group-hover:scale-105"
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
