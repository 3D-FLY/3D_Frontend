import stepConnect     from "./step-connect.png";
import stepUpload      from "./step-upload.png";
import stepSell        from "./step-sell.png";
import stepRouting     from "./ChatGPT Image Jun 1, 2026, 10_02_17 AM.png";
import stepFulfillment from "./step-fulfillment.png";
import stepScale       from "./ChatGPT Image Jun 1, 2026, 10_29_18 AM.png";

export type ExploreContent = {
  id: number;
  title: string;
  subtitle: string;
  description: string[];
  bullets?: string[];
  /** If set, bullets are rendered after this description index (0-based) */
  bulletsAfterIndex?: number;
  image: string;
};

export const EXPLORE_CONTENT = [
  {
    id: 1,
    title: "Connect Your Stores",
    subtitle: "Sign up and get started",
    description: [
      "Connect your online store (or stores) of Shopify, Etsy, or any of the supported platforms. Our API integration is quick, clean, and doesn't require you to touch a single line of code. Once connected, your products, orders, and workflows sync automatically with 3D-Fly. No manual updates, no copy-pasting, no \"did I forget to update that?\".",
      "From here on - the hard part is over. Your store and our system work as one.", 
      "Let the fun begin!",
    ],
    image: stepConnect,
  },
  {
    id: 2,
    title: "Upload Your STL Files",
    subtitle: "Upload your products, choose print quality and settings along with assembly instructions",
    description: [
      "Upload your 3D models and define exactly how they should be produced: Choose material, color, dimensions, and any other production requirements.",
      "Once having the models in our system, your 3D-Fly account acts as a central hub for all your products across all your stores. From one place, you can manage your entire catalog and assign products to different stores either synchronously or differently between them.",
      "You can also include assembly instructions or special notes for production partners.",
      "This is where you stay in full control of your product, without dealing with the production itself.",
    ],
    image: stepUpload,
  },
  {
    id: 3,
    title: "Publish & SELL!",
    subtitle: "Sell it everywhere you want!",
    description: [
      "Once your products are set up, they're ready to be sold globally — directly from your store.",
      "No need to pre-produce inventory. No need to guess demand. Every order is triggered only when a customer actually buys.",
      "That means:",
      "You sell. We take care of everything that happens after checkout.",
    ],
    bulletsAfterIndex: 2,
    bullets: [
      "Zero upfront stock",
      "Zero storage",
      "Zero risk of unsold products",
    ],
    image: stepSell,
  },
  {
    id: 4,
    title: "Smart Production Routing",
    subtitle: "We automatically find the best production partner for each order",
    description: [
      "When an order comes in, 3D-Fly automatically routes it to the most suitable production partner.",
      "We consider:",
      "Each order is produced in the optimal place — without you needing to manage suppliers, compare quotes, or send files around.",
      "It just works.",
    ],
    bulletsAfterIndex: 1,
    bullets: [
      "Distance from customer",
      "Capabilities (materials and machines)",
      "Availability and efficiency",
    ],
    image: stepRouting,
  },
  {
    id: 5,
    title: "Production & Fulfillment",
    subtitle: "We take care of printing and shipping, from the printer to the customer's door",
    description: [
      "Your product is manufactured locally by one of our trusted partners and sent directly to your customer.",
      "No warehouses. No packing. No handling returns across continents.",
      "Everything is handled end-to-end:",
      "From your file to your customer's doorstep: clean, fast, and fully managed.",
    ],
    bulletsAfterIndex: 2,
    bullets: [
      "Production",
      "Quality control",
      "Packaging",
      "Shipping",
    ],
    image: stepFulfillment,
  },
  {
    id: 6,
    title: "Learn & Scale",
    subtitle: "Get insights, grow smarter",
    description: [
      "As your store grows, 3D-Fly doesn't just keep up — it helps you understand what's actually working.",
      "Instead of guessing, you gain real visibility into your products, your customers, and your performance. You start seeing patterns — what sells, where it works best, and where there's room to improve.",
      "This means you can make better decisions, faster. Focus on what works, refine what doesn't, and grow your business with confidence.",
      "And the best part? You scale without building any infrastructure.",
    ],
    image: stepScale,
  },
];