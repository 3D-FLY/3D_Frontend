import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Search } from "lucide-react";
import Background from "../components/ui/Background";

interface FAQItem {
  q: string;
  a: string;
}

interface FAQCategory {
  category: string;
  questions: FAQItem[];
}

const faqData: FAQCategory[] = [
  {
    category: "Concept",
    questions: [
      {
        q: "What is 3D-Fly, in simple terms?",
        a: "3D-Fly is a system that connects your products, your stores, and a global network of production partners into one seamless flow. You manage your products from one place. Everything else—production, routing, and fulfillment—happens automatically.",
      },
      {
        q: "How is this different from working directly with manufacturers?",
        a: "Instead of juggling suppliers, quotes, and logistics, you work through one system that handles it all for you. You define the product once. We take care of the rest.",
      },
      {
        q: "Why is this better than holding inventory?",
        a: "Because you don't need to guess demand. Products are only made after they're sold, so you avoid upfront costs, storage, and unsold stock.",
      },
      {
        q: "Can I really scale a business like this?",
        a: "Yes. The system is built to grow with you—so you can increase volume without adding operational complexity.",
      },
      {
        q: "What kind of creators is this for?",
        a: "Designers, makers, brands—anyone who wants to sell physical products without managing production and logistics.",
      },
    ],
  },
  {
    category: "Technical",
    questions: [
      {
        q: "How do I get started?",
        a: "Sign up, connect your store, upload your products, and you're ready to go. The setup is straightforward and doesn't require technical experience.",
      },
      {
        q: "Which platforms can I connect?",
        a: "We support major e-commerce platforms like Shopify and Etsy, with more integrations on the way.",
      },
      {
        q: "Can I connect multiple stores?",
        a: "Yes. Your 3D-Fly account acts as a central hub, allowing you to manage products across multiple stores and decide how they're assigned.",
      },
      {
        q: "How do I upload and define my products?",
        a: "You upload your 3D files and define how they should be produced—materials, variations, and any special instructions. From there, the system handles the rest.",
      },
      {
        q: "Do I need to manage orders manually?",
        a: "No. Orders are automatically processed, routed, produced, and shipped—without requiring your involvement.",
      },
    ],
  },
  {
    category: "Business & Growth",
    questions: [
      {
        q: "How do I make money with 3D-Fly?",
        a: "You set your product pricing in your store. We handle production and fulfillment, so your margin is built into your pricing strategy.",
      },
      {
        q: "Do I need to invest upfront?",
        a: "No. There's no need to produce inventory or build infrastructure before you start selling.",
      },
      {
        q: "Where are products manufactured?",
        a: "Orders are produced as close as possible to your customer using our network of local partners. This helps reduce delivery times and costs.",
      },
      {
        q: "Can I optimize and improve over time?",
        a: "Yes. As you grow, you gain visibility into what works—so you can refine your products and scale more effectively.",
      },
      {
        q: "Is this only for large brands?",
        a: "Not at all. You can start small and grow at your own pace—the system scales with you.",
      },
    ],
  },
  {
    category: "Troubleshooting",
    questions: [
      { q: "What happens if something goes wrong with an order?", a: "" },
      { q: "How do you ensure production quality?", a: "" },
      { q: "What if my product requires specific instructions?", a: "" },
      { q: "Can I track what's happening with my orders?", a: "" },
      { q: "Can I change my product setup after going live?", a: "" },
    ],
  },
];

const ALL_CATEGORY = "All";

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState<string>(ALL_CATEGORY);
  const [searchQuery, setSearchQuery] = useState("");
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggleItem = (id: string) =>
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const categories = faqData.map((cat) => cat.category);

  const filtered = faqData
    .filter((cat) => activeCategory === ALL_CATEGORY || cat.category === activeCategory)
    .flatMap((cat) =>
      cat.questions
        .filter((q) => q.q.toLowerCase().includes(searchQuery.toLowerCase()))
        .map((q) => ({ ...q, id: `${cat.category}-${q.q}` }))
    );

  return (
    <div dir="ltr">
      <Background variant="dark">
        {/* Hero */}
        <div className="mx-auto px-6 pt-24 pb-16 text-center">
          <h1 className="text-[clamp(22px,4.5vw,56px)] font-bold text-white whitespace-nowrap uppercase">
            Frequently asked questions
          </h1>
          <p className="mt-4 text-white/50 text-lg max-w-xl mx-auto">
            Find answers to the most common questions about 3D-Fly.
          </p>

          <div className="relative max-w-md mx-auto mt-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for a question..."
              className="border border-white/10 bg-white/[0.05] rounded-xl pl-11 pr-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-green-500/50 transition-colors w-full"
            />
          </div>
        </div>

        {/* Filter bar */}
        <div className="flex gap-3 flex-wrap justify-center mt-1 mb-8 px-6">
          {[ALL_CATEGORY, ...categories].map((cat) => {
            const isActive = cat === activeCategory;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`relative rounded-full px-5 py-2 text-sm uppercase transition-colors ${
                  isActive
                    ? "text-green-500 font-bold"
                    : "border border-white/10 bg-white/[0.05] text-white/50 font-medium hover:border-white/20 hover:text-white/70"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="active-pill"
                    className="absolute inset-0 rounded-full border border-green-500/40 bg-green-500/15"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{cat}</span>
              </button>
            );
          })}
        </div>

        {/* Accordion */}
        <div className="max-w-3xl mx-auto flex flex-col gap-3 px-6 pb-24">
          {filtered.map((item) => {
            const isOpen = openItems.has(item.id);
            return (
              <div
                key={item.id}
                className={`border rounded-2xl overflow-hidden backdrop-blur-sm transition-colors ${
                  isOpen
                    ? "border-green-500/30 bg-white/[0.07]"
                    : "border-white/10 bg-white/[0.05]"
                }`}
              >
                <div
                  onClick={() => toggleItem(item.id)}
                  className="flex items-center justify-between px-6 py-5 cursor-pointer"
                >
                  <span className="text-white font-semibold text-[15px]">
                    {item.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-white/50 flex-shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-5 text-white/60 text-[14px] leading-relaxed">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </Background>
    </div>
  );
}
