import { useRef, useState, type CSSProperties, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Search, X } from "lucide-react";
import Background from "../components/ui/Background.jsx";
import useNavbarHeight from "../components/layout/useNavbarHeight.js";

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
const EMPTY_ANSWER = "Answer coming soon";

/** Wraps matches of `query` in <mark>. */
function highlight(text: string, query: string): ReactNode {
  const q = query.trim();
  if (!q) return text;
  const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${escaped})`, "gi"));
  return parts.map((part, i) =>
    part.toLowerCase() === q.toLowerCase() ? (
      <mark key={i} className="rounded bg-green-500/25 px-0.5 text-white">
        {part}
      </mark>
    ) : (
      part
    ),
  );
}

interface FAQAccordionItemProps {
  id: string;
  question: string;
  answer: string;
  query: string;
  isOpen: boolean;
  onToggle: () => void;
}

function FAQAccordionItem({ id, question, answer, query, isOpen, onToggle }: FAQAccordionItemProps) {
  const panelId = `${id}-panel`;
  return (
    <div
      className={`overflow-hidden rounded-2xl border backdrop-blur-sm transition-colors ${
        isOpen ? "border-green-500/30 bg-white/[0.07]" : "border-white/10 bg-white/[0.05]"
      }`}
    >
      <h3 className="m-0">
        <button
          type="button"
          id={id}
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={panelId}
          className="flex min-h-[56px] w-full items-center justify-between gap-4 px-5 py-4 text-left focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-green-500 md:px-6"
        >
          <span className="text-base font-semibold text-white">{highlight(question, query)}</span>
          <ChevronDown
            className={`h-5 w-5 flex-shrink-0 text-white/50 transition-transform duration-300 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={id}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            {answer ? (
              <p className="px-5 pb-5 text-[15px] leading-relaxed text-white/60 md:px-6">
                {highlight(answer, query)}
              </p>
            ) : (
              <p className="px-5 pb-5 text-[15px] italic text-white/40 md:px-6">{EMPTY_ANSWER}</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FAQMobile() {
  const [activeCategory, setActiveCategory] = useState<string>(ALL_CATEGORY);
  const [searchQuery, setSearchQuery] = useState("");
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());
  const navHeight = useNavbarHeight();
  const [searchOpen, setSearchOpen] = useState(false);
  const searchIconRef = useRef<HTMLButtonElement>(null);

  const closeSearch = () => {
    setSearchOpen(false);
    setSearchQuery("");
    requestAnimationFrame(() => searchIconRef.current?.focus());
  };

  const toggleItem = (id: string) =>
    setOpenItems((prev) => {
      const next = new Set<string>(); // single open at a time on phones
      if (prev.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const q = searchQuery.trim().toLowerCase();

  const groups = faqData
    .map((cat, ci) => ({
      category: cat.category,
      items: cat.questions
        .map((item, qi) => ({ ...item, id: `faq-${ci}-${qi}` }))
        .filter(
          (item) => !q || item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q),
        ),
    }))
    .filter((g) => (activeCategory === ALL_CATEGORY || g.category === activeCategory) && g.items.length > 0);

  const totalResults = groups.reduce((n, g) => n + g.items.length, 0);

  const pills = (layoutId: string) =>
    [ALL_CATEGORY, ...faqData.map((c) => c.category)].map((cat) => {
      const isActive = cat === activeCategory;
      const count =
        cat === ALL_CATEGORY
          ? faqData.reduce((n, c) => n + c.questions.length, 0)
          : (faqData.find((c) => c.category === cat)?.questions.length ?? 0);
      return (
        <button
          key={cat}
          type="button"
          role="tab"
          aria-selected={isActive}
          onClick={() => setActiveCategory(cat)}
          className={`relative min-h-[40px] shrink-0 rounded-full px-4 py-2 text-sm uppercase transition-colors md:px-5 ${
            isActive
              ? "font-bold text-green-500"
              : "border border-white/10 bg-white/[0.05] font-medium text-white/50 hover:border-white/20 hover:text-white/70"
          }`}
        >
          {isActive && (
            <motion.span
              layoutId={layoutId}
              className="absolute inset-0 rounded-full border border-green-500/40 bg-green-500/15"
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
            />
          )}
          <span className="relative z-10">
            {cat} <span className="text-[0.85em] opacity-60">· {count}</span>
          </span>
        </button>
      );
    });

  return (
    <div dir="ltr" style={{ "--nav-h": `${navHeight}px` } as CSSProperties}>
      <Background variant="dark" className="overflow-clip!">
        {/* Hero */}
        <div className="mx-auto px-6 pb-4 pt-10 text-center md:pb-10 md:pt-24">
          <h1 className="text-[clamp(22px,6vw,56px)] font-bold uppercase leading-tight text-white md:whitespace-nowrap">
            Frequently asked questions
          </h1>
          <p className="mx-auto mt-4 hidden max-w-xl text-lg text-white/50 md:block">
            Find answers to the most common questions about 3D-Fly.
          </p>
        </div>

        {/* Sticky search + categories */}
        <div className="sticky top-[var(--nav-h)] z-30 border-y border-white/5 bg-dark/90 py-3 backdrop-blur">
          {/* Desktop: search field always visible */}
          <div className="relative mx-auto hidden max-w-md px-6 md:block">
            <Search className="pointer-events-none absolute left-10 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for a question..."
              aria-label="Search questions"
              className="w-full rounded-xl border border-white/10 bg-white/[0.05] py-3 pl-11 pr-4 text-base text-white outline-none transition-colors placeholder:text-white/30 focus:border-green-500/50"
            />
          </div>

          {/* Desktop: category pills */}
          <div
            className="mt-3 hidden flex-wrap justify-center gap-2 px-6 pb-1 md:flex"
            role="tablist"
            aria-label="Question categories"
          >
            {pills("active-pill-desktop")}
          </div>

          {/* Mobile: search icon + pills, or the search field in place of the pills */}
          <div className="px-4 md:hidden">
            {searchOpen ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2"
              >
                <div className="relative min-w-0 flex-1">
                  <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                  <input
                    type="search"
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Escape" && closeSearch()}
                    placeholder="Search for a question..."
                    aria-label="Search questions"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.05] py-2.5 pl-10 pr-4 text-base text-white outline-none transition-colors placeholder:text-white/30 focus:border-green-500/50"
                  />
                </div>
                <button
                  type="button"
                  onClick={closeSearch}
                  aria-label="Close search"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 text-white/70 transition-colors hover:text-white"
                >
                  <X size={18} />
                </button>
              </motion.div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  ref={searchIconRef}
                  type="button"
                  onClick={() => setSearchOpen(true)}
                  aria-label="Search questions"
                  aria-expanded={false}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-white/70 transition-colors hover:text-white"
                >
                  <Search size={18} />
                </button>
                <div
                  className="flex min-w-0 flex-1 flex-nowrap gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                  role="tablist"
                  aria-label="Question categories"
                >
                  {pills("active-pill-mobile")}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="mx-auto flex max-w-3xl flex-col gap-8 px-4 pb-24 pt-8 md:px-6">
          {totalResults === 0 ? (
            <div className="flex flex-col items-center gap-4 py-16 text-center" role="status">
              <p className="text-white/60">No questions found.</p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory(ALL_CATEGORY);
                }}
                className="min-h-[44px] rounded-full border border-green-500/40 px-5 text-sm font-bold uppercase tracking-wide text-green-500 transition-colors hover:bg-green-500/10"
              >
                Clear search
              </button>
            </div>
          ) : (
            groups.map((group) => (
              <section key={group.category} aria-label={group.category}>
                {activeCategory === ALL_CATEGORY && (
                  <h2 className="mb-3 flex items-baseline gap-2 text-sm font-bold uppercase tracking-[0.12em] text-green-500">
                    {group.category}
                    <span className="text-xs font-medium text-white/40">{group.items.length}</span>
                  </h2>
                )}
                <div className="flex flex-col gap-3">
                  {group.items.map((item) => (
                    <FAQAccordionItem
                      key={item.id}
                      id={item.id}
                      question={item.q}
                      answer={item.a}
                      query={searchQuery}
                      isOpen={openItems.has(item.id)}
                      onToggle={() => toggleItem(item.id)}
                    />
                  ))}
                </div>
              </section>
            ))
          )}
        </div>
      </Background>
    </div>
  );
}

// ─── Desktop (original layout, unchanged) ───────────────────────────────────────
function FAQDesktop() {
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

/** Desktop (md+) keeps the original layout; phones get the mobile-first layout above. */
export default function FAQPage() {
  return (
    <>
      <div className="md:hidden">
        <FAQMobile />
      </div>
      <div className="hidden md:block">
        <FAQDesktop />
      </div>
    </>
  );
}
