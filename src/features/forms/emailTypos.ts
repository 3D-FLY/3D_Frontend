// "Did you mean …?" for common email domain typos. Only a hint: it never blocks
// submission, and the user decides whether to apply it.

const DOMAIN_FIXES: Record<string, string> = {
  // Gmail
  "gmial.com": "gmail.com",
  "gmal.com": "gmail.com",
  "gmaill.com": "gmail.com",
  "gamil.com": "gmail.com",
  "gnail.com": "gmail.com",
  "gmai.com": "gmail.com",
  "gmil.com": "gmail.com",
  "gmail.co": "gmail.com",
  "gmail.cm": "gmail.com",
  "gmailcom": "gmail.com",
  // Hotmail
  "hotmial.com": "hotmail.com",
  "hotmal.com": "hotmail.com",
  "hotmai.com": "hotmail.com",
  "hotamil.com": "hotmail.com",
  "hotmil.com": "hotmail.com",
  "hotmail.co": "hotmail.com",
  // Yahoo
  "yaho.com": "yahoo.com",
  "yahooo.com": "yahoo.com",
  "yhoo.com": "yahoo.com",
  "yahoo.cm": "yahoo.com",
  // Outlook
  "outlok.com": "outlook.com",
  "outllook.com": "outlook.com",
  "outlook.co": "outlook.com",
  // iCloud
  "iclod.com": "icloud.com",
  "icoud.com": "icloud.com",
  "icloud.co": "icloud.com",
};

// Top-level-domain typos fixed for any domain ("company.con" → "company.com").
const TLD_FIXES: Record<string, string> = {
  con: "com",
  cmo: "com",
  comm: "com",
  vom: "com",
  xom: "com",
};

/** Returns the corrected address, or undefined when nothing looks wrong. */
export function suggestEmailFix(email: string): string | undefined {
  const value = email.trim();
  const at = value.lastIndexOf("@");
  if (at < 1 || at === value.length - 1) return undefined;
  const local = value.slice(0, at);
  const domain = value.slice(at + 1).toLowerCase();

  const direct = DOMAIN_FIXES[domain];
  if (direct) return `${local}@${direct}`;

  const dot = domain.lastIndexOf(".");
  if (dot > 0) {
    const tld = TLD_FIXES[domain.slice(dot + 1)];
    if (tld) {
      const fixedDomain = `${domain.slice(0, dot)}.${tld}`;
      return `${local}@${DOMAIN_FIXES[fixedDomain] ?? fixedDomain}`;
    }
  }
  return undefined;
}
