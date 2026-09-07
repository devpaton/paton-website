// The words drawn inside the SVG illustrations, and the aria-label each illustration
// carries for a screen reader. The drawings themselves are shared between the two language
// trees; only the text nodes swap, read as `art[lang]`.
//
// Keep the German tag words short. They sit in a fixed 62px pill in hero-art.njk and
// ward-art.njk, so anything longer than about six characters overflows it.
module.exports = {
  de: {
    nurseDevice: "PFLEGEGERÄT",
    nurseDeviceWard: "PFLEGEGERÄT · STATION 3",
    bedDevice: "BETTGERÄT",
    ward: "STATION 3 · OST",
    routed: "ZUGEWIESEN",
    emergency: "Notfall",
    painRelief: "Schmerzmittel",
    bathroom: "Hilfe zur Toilette",
    nothingOpen: "Nichts offen",
    room: "Zimmer",
    bed: "Bett",
    tagNow: "SOFORT",
    tagNurse: "PFLEGE",
    tagAssist: "HILFE",
    heroFoot: "Sortiert nach Dringlichkeit, dann nach Nähe.",
    wardFoot: "Sie erscheint an ihrem Platz in der Reihenfolge. Notfälle bleiben zuoberst.",
    heroAria:
      "Ein Bettgerät sendet einen konkreten Bedarf; das Pflegegerät zeigt priorisierte Meldungen " +
      "mit Zimmer, Wartezeit und der jeweils benötigten Qualifikation.",
    wardAria:
      "Drei Betten auf einer Station. Ein Bettgerät meldet den Bedarf nach Schmerzmitteln, und " +
      "die Meldung erscheint auf dem Pflegegerät an zweiter Stelle — unter einem Notfall, über " +
      "einer länger wartenden Hilfeanfrage — mit der benötigten Qualifikation gekennzeichnet.",
    bedDeviceAria:
      "Ein Bettgerät: eine grosse Taste für einen Bedarf, eine zurückhaltendere zweite Auswahl, " +
      "darunter eine separate Notfalltaste, und die Meldung verlässt das Bett.",
    nurseDeviceAria:
      "Ein Gerät im Dienst, das drei offene Meldungen in ihrer Reihenfolge zeigt, mit einem " +
      "Notfall zuoberst, während eine neue eintrifft.",
    nurseFigureAria: "Eine Pflegefachperson blickt auf ein Telefon, auf dem eine neue Meldung eintrifft.",
    stepRaisedAria: "Eine Taste am Bettgerät wird gedrückt und sendet eine Meldung ab.",
    stepPrioritisedAria:
      "Drei gestapelte Meldungszeilen nach Dringlichkeit sortiert, wobei ein Pfeil die " +
      "dringendste nach oben hebt.",
    stepRoutedAria:
      "Eine Meldung läuft entlang eines gestrichelten Pfades zu der Person, die für die " +
      "Beantwortung qualifiziert ist.",
    stepRecordedAria: "Ein Protokoll beantworteter Meldungen, bei dem die letzte abgehakt ist.",
  },
  en: {
    nurseDevice: "NURSE DEVICE",
    nurseDeviceWard: "NURSE DEVICE · WARD 3",
    bedDevice: "BED DEVICE",
    ward: "WARD 3 · EAST",
    routed: "ROUTED",
    emergency: "Emergency",
    painRelief: "Pain relief",
    bathroom: "Help to the bathroom",
    nothingOpen: "Nothing open",
    room: "Room",
    bed: "Bed",
    tagNow: "NOW",
    tagNurse: "NURSE",
    tagAssist: "ASSIST",
    heroFoot: "Sorted by urgency, then by who is closest.",
    wardFoot: "It arrives in its place in the queue. Emergencies stay on top.",
    heroAria:
      "A bed device sends a specific need; the nurse device shows prioritised alerts with room, " +
      "waiting time and the qualification each one needs.",
    wardAria:
      "Three beds on one ward. One bed device raises a request for pain relief, and it arrives " +
      "on the nurse device in second place — below an emergency, above a longer-waiting assist — " +
      "tagged with the qualification it needs.",
    bedDeviceAria:
      "A bed device: one large button for a need, a quieter second choice, a separate emergency " +
      "button underneath, and the call leaving the bed.",
    nurseDeviceAria:
      "A phone carried on shift, showing three open requests in order with an emergency at the " +
      "top, as a new one arrives.",
    nurseFigureAria: "A nurse glancing at a phone as a new request arrives on it.",
    stepRaisedAria: "A button on a bed device being pressed, sending a request out.",
    stepPrioritisedAria:
      "Three stacked request rows ordered by urgency, with an arrow lifting the most urgent one " +
      "to the top.",
    stepRoutedAria:
      "A request travelling along a dashed path to the member of staff qualified to answer it.",
    stepRecordedAria: "A logged record of answered requests, with the last one ticked off.",
  },
};
