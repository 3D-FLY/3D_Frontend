import ScrollableContent from "./ScrollableContent.js";

interface NotificationListProps {
  items: string[];
}



export default function NotificationList({ items }: NotificationListProps) {
  return (
    <div className="flex min-h-0 w-full flex-1 flex-col overflow-hidden">
      <ScrollableContent scrollbarSide="left">
        {items.map((item, index) => (
          <p
            key={index}
            className={`py-2 text-[clamp(13.5px,calc(0.8125rem+0.2vw),14.5px)] font-semibold tracking-wide text-black uppercase ${
              index < items.length - 1 ? "border-b-[0.5px] border-white/50" : ""
            }`}
          >
            {item}
          </p>
        ))}
      </ScrollableContent>
    </div>
  );
}
