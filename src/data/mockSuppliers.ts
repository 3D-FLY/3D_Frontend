export interface Supplier {
  id: string;
  name: string;
  contactName: string;
  email: string;
  city: string;
  country: string;
  coordinates: [number, number]; // [lng, lat]
  technologies: ("FDM" | "SLS" | "SLA")[];
  materials: string[];
  colors: string[];
  printerCount: number;
  maxParallelJobs: number;
  isActive: boolean;
  joinedAt: string;
  rating: number;
  capabilities?: {
    printerCount: number;
    maxParallelJobs: number;
    workingHours: { from: string; to: string };
    isActive: boolean;
  };
}

export const mockSuppliers: Supplier[] = [
  {
    id: "SUP-001", name: "PrintLab Berlin", contactName: "David Print",
    email: "david@printlab.io", city: "Berlin", country: "Germany",
    coordinates: [13.405, 52.52],
    technologies: ["FDM", "SLS"], materials: ["PLA", "ABS", "PETG"],
    colors: ["#222222", "#ffffff", "#facc15", "#3b82f6"],
    printerCount: 3, maxParallelJobs: 2,
    isActive: true, joinedAt: "2024-09-10", rating: 4.8,
    capabilities: {
      printerCount: 3,
      maxParallelJobs: 2,
      workingHours: { from: "08:00", to: "18:00" },
      isActive: true,
    },
  },
  {
    id: "SUP-002", name: "3D Masters NY", contactName: "Mike Ross",
    email: "mike@3dmasters.com", city: "New York", country: "USA",
    coordinates: [-74.006, 40.7128],
    technologies: ["FDM"], materials: ["PLA", "TPU", "ASA"],
    colors: ["#222222", "#ef4444", "#a855f7"],
    printerCount: 5, maxParallelJobs: 4,
    isActive: true, joinedAt: "2024-08-01", rating: 4.5,
  },
  {
    id: "SUP-003", name: "FormLabs TLV", contactName: "Yossi Shapira",
    email: "yossi@formlabs-tlv.com", city: "Tel Aviv", country: "Israel",
    coordinates: [34.7818, 32.0853],
    technologies: ["FDM", "SLA"], materials: ["PLA", "ABS", "PETG", "TPU"],
    colors: ["#222222", "#ffffff", "#5ac422", "#f97316"],
    printerCount: 2, maxParallelJobs: 2,
    isActive: true, joinedAt: "2025-01-05", rating: 4.2,
  },
  {
    id: "SUP-004", name: "AlphaForm London", contactName: "James Carter",
    email: "james@alphaform.co.uk", city: "London", country: "UK",
    coordinates: [-0.1276, 51.5074],
    technologies: ["SLS", "SLA"], materials: ["ABS", "ASA", "PETG"],
    colors: ["#222222", "#ffffff", "#3b82f6"],
    printerCount: 4, maxParallelJobs: 3,
    isActive: true, joinedAt: "2024-11-20", rating: 3.9,
  },
  {
    id: "SUP-005", name: "TokyoPrint Labs", contactName: "Yuki Tanaka",
    email: "yuki@tokyoprint.jp", city: "Tokyo", country: "Japan",
    coordinates: [139.6917, 35.6895],
    technologies: ["FDM", "SLS"], materials: ["PLA", "PETG", "ASA"],
    colors: ["#ffffff", "#222222", "#f97316", "#a855f7"],
    printerCount: 6, maxParallelJobs: 5,
    isActive: true, joinedAt: "2024-07-15", rating: 4.7,
  },
];

export function getSupplierById(id: string): Supplier | undefined {
  return mockSuppliers.find((s) => s.id === id);
}
