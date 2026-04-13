interface NotificationListProps {
  items: string[];
}

function highlightOrderNumber(text: string) {
  // Highlight leading order/product references like #3012 in green
  const parts = text.split(/^(#\d+)/);
  if (parts.length > 1) {
    return (
      <>
        <span className="font-semibold text-green-400">{parts[1]}</span>
        {parts.slice(2).join("")}
      </>
    );
  }
  return text;
}

export default function NotificationList({ items }: NotificationListProps) {
  return (
    <div className="rounded-lg bg-zinc-900 p-4">
      {items.map((item, index) => (
        <p
          key={index}
          className={`py-2 text-sm text-zinc-300 ${
            index < items.length - 1 ? "border-b border-zinc-700" : ""
          }`}
        >
          {highlightOrderNumber(item)}
        </p>
      ))}
    </div>
  );
}
