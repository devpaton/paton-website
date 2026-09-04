// Language-neutral facts about the company. Everything that has words in it — navigation,
// footer headings, button labels — lives in src/_data/ui.js, keyed by language.
module.exports = {
  name: "PATON",
  tagline: "Patients to nurses.",
  // Meta description fallback, per language.
  description: {
    de:
      "PATON baut ein intelligentes Schwesternrufsystem, das der Station sagt, was eine " +
      "Patientin oder ein Patient tatsächlich braucht — damit die richtige Person mit dem " +
      "Richtigen in der Hand ins richtige Zimmer geht.",
    en:
      "PATON builds a smart nurse-call system that tells the ward what a patient actually needs, " +
      "so the right person goes to the right room with the right thing in hand.",
  },
  url: "https://paton.ch",
  languages: ["de", "en"],
  defaultLanguage: "de",
  email: "info@paton.ch",
  city: { de: "Zürich", en: "Zurich" },
  country: { de: "Schweiz", en: "Switzerland" },
  founded: 2021,
  social: {
    linkedin: "https://www.linkedin.com/company/paton",
    twitter: "https://twitter.com/PatonSwiss",
  },
};
