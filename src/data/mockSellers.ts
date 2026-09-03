export interface Seller {
  id: string;
  name: string;
  ownerName: string;
  email: string;
  city: string;
  country: string;
  plan: "Basic" | "Pro" | "Enterprise";
  platforms: string[];
  joinedAt: string;
  isActive: boolean;
}

export const mockSellers: Seller[] = [
  {
    id: "SEL-001", name: "Raz3DPrints", ownerName: "Raz Malka",
    email: "raz@3dfly.com", city: "Tel Aviv", country: "Israel",
    plan: "Pro", platforms: ["shopify", "ebay", "woocommerce"],
    joinedAt: "2024-11-01", isActive: true,
  },
  {
    id: "SEL-002", name: "Mini World", ownerName: "Dana Levi",
    email: "dana@miniworld.com", city: "Haifa", country: "Israel",
    plan: "Basic", platforms: ["wix", "etsy"],
    joinedAt: "2024-12-15", isActive: true,
  },
  {
    id: "SEL-003", name: "Galaxy Toys", ownerName: "Tom Cohen",
    email: "tom@galaxytoys.com", city: "New York", country: "USA",
    plan: "Enterprise", platforms: ["shopify", "amazon", "ebay"],
    joinedAt: "2024-10-05", isActive: true,
  },
];

export function getSellerById(id: string): Seller | undefined {
  return mockSellers.find((s) => s.id === id);
}
