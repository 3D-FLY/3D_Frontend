// Plain strings may contain **bold** segments and email addresses (rendered as mailto links).
export type LegalBlock =
  | { type: "p"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] };

export interface LegalSection {
  heading: string;
  blocks: LegalBlock[];
}

export interface LegalDocument {
  title: string;
  lastUpdated: string;
  intro: string[];
  sections: LegalSection[];
}
