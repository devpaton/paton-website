// Everything the shared shell — header, footer, skip link, language switcher — needs to say,
// in both languages. Templates read `ui[lang]`, where `lang` comes from the directory data
// file of the language tree the page lives in (src/de/de.json, src/en/en.json).
//
// Page copy is NOT here. Each page is a real file per language under src/de/ and src/en/,
// so a translator edits prose in context rather than hunting for keys.
module.exports = {
  de: {
    htmlLang: "de-CH",
    skipToContent: "Zum Inhalt springen",
    menu: "Menü",
    homeAria: "PATON Startseite",
    navAria: "Hauptnavigation",
    talkToUs: "Kontakt aufnehmen",
    talkToUsSubject: "PATON — Kontakt",
    languageAria: "Sprache",
    languageOther: "Auf Englisch lesen",
    footerSite: "Website",
    footerLegal: "Rechtliches",
    footerContact: "Kontakt",
    rightsReserved: "PATON. Alle Rechte vorbehalten.",
    noCookies: "Diese Website setzt keine Tracking- oder Analyse-Cookies.",
    nav: [
      { text: "Problem", url: "/challenge/" },
      { text: "Lösung", url: "/solution/" },
      { text: "Fallstudie", url: "/case-study/" },
      { text: "Einsparrechner", url: "/savings-calculator/" },
      { text: "Über uns", url: "/about/" },
    ],
    legalNav: [
      { text: "Impressum", url: "/legalnotice/" },
      { text: "Datenschutzerklärung", url: "/privacy-policy/" },
      { text: "Cookie-Richtlinie", url: "/cookie-policy/" },
    ],
  },
  en: {
    htmlLang: "en",
    skipToContent: "Skip to content",
    menu: "Menu",
    homeAria: "PATON home",
    navAria: "Main",
    talkToUs: "Talk to us",
    talkToUsSubject: "PATON — talk to us",
    languageAria: "Language",
    languageOther: "Read this page in German",
    footerSite: "Site",
    footerLegal: "Legal",
    footerContact: "Contact",
    rightsReserved: "PATON. All rights reserved.",
    noCookies: "This site sets no tracking or analytics cookies.",
    nav: [
      { text: "Problem", url: "/en/challenge/" },
      { text: "Solution", url: "/en/solution/" },
      { text: "Case study", url: "/en/case-study/" },
      { text: "Savings calculator", url: "/en/savings-calculator/" },
      { text: "About", url: "/en/about/" },
    ],
    legalNav: [
      { text: "Legal notice", url: "/en/legalnotice/" },
      { text: "Privacy policy", url: "/en/privacy-policy/" },
      { text: "Cookie policy", url: "/en/cookie-policy/" },
    ],
  },
};
