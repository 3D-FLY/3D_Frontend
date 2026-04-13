interface ProductionItem {
  name: string;
  image: string;
  location: string;
}

interface ProductionCarouselProps {
  items: ProductionItem[];
}

export default function ProductionCarousel({ items }: ProductionCarouselProps) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-track-zinc-900 scrollbar-thumb-zinc-600">
      {items.map((item, index) => (
        <div
          key={index}
          className="flex min-w-[140px] flex-col items-center rounded-lg bg-zinc-900 p-3 text-center"
        >
          <div className="mb-2 h-20 w-full overflow-hidden rounded-md bg-zinc-800">
            <img
              src={item.image}
              alt={item.name}
              className="h-full w-full object-cover"
            />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wide text-green-400">
            {item.name}
          </span>
          <span className="mt-1 text-xs text-zinc-400">{item.location}</span>
        </div>
      ))}
    </div>
  );
}
