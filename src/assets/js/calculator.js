// Savings calculator (issue #52).
//
// Everything happens in the visitor's browser. No request is made, nothing is stored,
// no cookie is set. The optional "email me this" action only opens the visitor's own
// mail client with the figures pre-filled — we never see the address.
//
// RULE — DO NOT CHANGE WITHOUT A PRODUCT DECISION:
// the released time is never expressed as full-time equivalents or as a headcount
// reduction. Nursing is short-staffed; the value we sell is time handed back to the
// team on shift, not fewer people on the payroll. Show hours and minutes only.
(function () {
  "use strict";

  var root = document.getElementById("calculator");
  if (!root) return;

  var config = JSON.parse(document.getElementById("calculator-config").textContent);
  var DAYS_PER_YEAR = 365;

  // Only the handful of strings this script writes into the page. Everything else on the
  // page is already translated by the template it came from. The page names its own
  // language on #calculator, so this stays a lookup rather than an i18n runtime.
  var STRINGS = {
    de: {
      hours: " h",
      minutes: " Minuten",
      minShort: " Min.",
      perFranc: "× der Richtkosten",
      needEmail: "Bitte zuerst eine E-Mail-Adresse eingeben.",
      mailOpened:
        "Ihr E-Mail-Programm sollte sich mit der Zusammenfassung öffnen. An uns wurde nichts gesendet.",
      subject: "PATON — Richtwert zur Zeitersparnis",
      summary: {
        title: "PATON — Richtwert zur Zeitersparnis",
        inputs: "Ihre Angaben",
        beds: "  Betten: ",
        occupancy: "  Auslastung: ",
        calls: "  Rufe pro Patiententag: ",
        wasted: "  Zeitverlust pro Ruf: ",
        wastedUnit: " Minuten",
        cost: "  Pflegekosten pro Stunde: CHF ",
        patonCost: "  Richtwert PATON-Kosten pro Bett und Jahr: CHF ",
        result: "Modelliertes Ergebnis pro Jahr",
        resultCalls: "  Schwesternrufe: ",
        resultHours: "  Aktuell verlorene Pflegezeit: ",
        resultHoursUnit: " Stunden",
        resultValue: "  Wert dieser Zeit: CHF ",
        resultPatonCost: "  Richtwert PATON-Kosten: CHF ",
        resultNet: "  Netto-Nutzen: CHF ",
        // Never an FTE or headcount figure — see the rule above.
        resultReturned: "  Zurückgegebene Zeit pro Bett und Tag: ",
        footer: "Dies ist ein Modell, keine Offerte. Annahmen und Formel: ",
        path: "/savings-calculator/",
      },
    },
    en: {
      hours: " h",
      minutes: " minutes",
      minShort: " min",
      perFranc: "× the indicative cost",
      needEmail: "Add an email address first.",
      mailOpened: "Your email app should open with the summary. Nothing was sent to us.",
      subject: "PATON — indicative savings estimate",
      summary: {
        title: "PATON — indicative savings estimate",
        inputs: "Your inputs",
        beds: "  Beds: ",
        occupancy: "  Occupancy: ",
        calls: "  Calls per patient-day: ",
        wasted: "  Time lost per call: ",
        wastedUnit: " minutes",
        cost: "  Nursing cost per hour: CHF ",
        patonCost: "  Indicative PATON cost per bed per year: CHF ",
        result: "Modelled result per year",
        resultCalls: "  Nurse calls: ",
        resultHours: "  Nursing time currently lost: ",
        resultHoursUnit: " hours",
        resultValue: "  Value of that time: CHF ",
        resultPatonCost: "  Indicative PATON cost: CHF ",
        resultNet: "  Net benefit: CHF ",
        // Never an FTE or headcount figure — see the rule above.
        resultReturned: "  Time handed back per bed per day: ",
        footer: "This is a model, not a quote. Assumptions and formula: ",
        path: "/en/savings-calculator/",
      },
    },
  };

  var text = STRINGS[root.getAttribute("data-lang")] || STRINGS.de;

  // Swiss number formatting in both languages: 532'182, never 532,182 or 532.182.
  var chf = new Intl.NumberFormat("de-CH", {
    maximumFractionDigits: 0,
  });
  var decimal = new Intl.NumberFormat("de-CH", {
    maximumFractionDigits: 1,
  });

  var fields = {};
  Object.keys(config.defaults).forEach(function (key) {
    fields[key] = {
      range: root.querySelector('[data-range="' + key + '"]'),
      number: root.querySelector('[data-number="' + key + '"]'),
    };
  });

  var outputs = {};
  Array.prototype.forEach.call(root.querySelectorAll("[data-out]"), function (el) {
    outputs[el.getAttribute("data-out")] = el;
  });

  function readValue(key) {
    var input = fields[key].number || fields[key].range;
    var limits = config.limits[key];
    var value = parseFloat(input.value);
    if (!isFinite(value)) value = config.defaults[key];
    return Math.min(limits.max, Math.max(limits.min, value));
  }

  function model(input) {
    var occupiedBedDays = input.beds * (input.occupancy / 100) * DAYS_PER_YEAR;
    var calls = occupiedBedDays * input.callsPerPatientDay;
    var minutesLost = calls * input.wastedMinutesPerCall;
    var hoursLost = minutesLost / 60;
    var annualSaving = hoursLost * input.nursingCostPerHour;
    var patonCost = input.beds * input.patonCostPerBedPerYear;

    return {
      occupiedBedDays: occupiedBedDays,
      calls: calls,
      hoursLost: hoursLost,
      annualSaving: annualSaving,
      patonCost: patonCost,
      netBenefit: annualSaving - patonCost,
      // Ratio of value returned per franc spent; 0 guard keeps the display sane.
      ratio: patonCost > 0 ? annualSaving / patonCost : null,
      // Soft capacity framing only — minutes back per bed per day. Never an FTE count.
      minutesPerBedPerDay:
        input.beds > 0 ? (input.callsPerPatientDay * (input.occupancy / 100)) * input.wastedMinutesPerCall : 0,
    };
  }

  function set(name, text) {
    if (outputs[name]) outputs[name].textContent = text;
  }

  var lastSummary = "";

  function render() {
    var input = {};
    Object.keys(config.defaults).forEach(function (key) {
      input[key] = readValue(key);
    });

    var result = model(input);

    set("annualSaving", "CHF " + chf.format(result.annualSaving));
    set("hoursLost", chf.format(result.hoursLost) + text.hours);
    set("calls", chf.format(result.calls));
    set("bedDays", chf.format(result.occupiedBedDays));
    set("patonCost", "CHF " + chf.format(result.patonCost));
    set("grossSaving", "CHF " + chf.format(result.annualSaving));
    set("netBenefit", "CHF " + chf.format(result.netBenefit));
    set(
      "ratio",
      result.ratio === null ? "—" : decimal.format(result.ratio) + text.perFranc
    );
    set("minutesPerBedPerDay", decimal.format(result.minutesPerBedPerDay) + text.minutes);

    // Field read-outs next to each slider.
    set("bedsValue", chf.format(input.beds));
    set("occupancyValue", chf.format(input.occupancy) + "%");
    set("callsPerPatientDayValue", decimal.format(input.callsPerPatientDay));
    set("wastedMinutesPerCallValue", decimal.format(input.wastedMinutesPerCall) + text.minShort);
    set("nursingCostPerHourValue", "CHF " + chf.format(input.nursingCostPerHour));
    set("patonCostPerBedPerYearValue", "CHF " + chf.format(input.patonCostPerBedPerYear));

    syncPresets(input.beds);

    var s = text.summary;
    lastSummary = [
      s.title,
      "",
      s.inputs,
      s.beds + chf.format(input.beds),
      s.occupancy + chf.format(input.occupancy) + "%",
      s.calls + decimal.format(input.callsPerPatientDay),
      s.wasted + decimal.format(input.wastedMinutesPerCall) + s.wastedUnit,
      s.cost + chf.format(input.nursingCostPerHour),
      s.patonCost + chf.format(input.patonCostPerBedPerYear),
      "",
      s.result,
      s.resultCalls + chf.format(result.calls),
      s.resultHours + chf.format(result.hoursLost) + s.resultHoursUnit,
      s.resultValue + chf.format(result.annualSaving),
      s.resultPatonCost + chf.format(result.patonCost),
      s.resultNet + chf.format(result.netBenefit),
      s.resultReturned + decimal.format(result.minutesPerBedPerDay) + s.wastedUnit,
      "",
      s.footer + window.location.origin + s.path,
    ].join("\n");
  }

  // Keep the slider and the number box for one input in step with each other.
  Object.keys(fields).forEach(function (key) {
    var pair = fields[key];
    ["range", "number"].forEach(function (kind) {
      var el = pair[kind];
      if (!el) return;
      el.addEventListener("input", function () {
        var value = readValue(key);
        if (pair.range && pair.range !== el) pair.range.value = value;
        if (pair.number && pair.number !== el && document.activeElement !== pair.number) {
          pair.number.value = value;
        }
        render();
      });
      el.addEventListener("change", function () {
        var value = readValue(key);
        if (pair.range) pair.range.value = value;
        if (pair.number) pair.number.value = value;
        render();
      });
    });
  });

  var presetButtons = Array.prototype.slice.call(root.querySelectorAll("[data-preset-beds]"));

  function syncPresets(beds) {
    presetButtons.forEach(function (button) {
      var match = parseFloat(button.getAttribute("data-preset-beds")) === beds;
      button.setAttribute("aria-pressed", String(match));
    });
  }

  presetButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      var beds = parseFloat(button.getAttribute("data-preset-beds"));
      if (fields.beds.range) fields.beds.range.value = beds;
      if (fields.beds.number) fields.beds.number.value = beds;
      render();
    });
  });

  // Optional, opt-in only: builds a mailto: so the visitor mails the summary to
  // themselves. No form is submitted and no address reaches PATON or any third party.
  var shareForm = root.querySelector("[data-share-form]");
  if (shareForm) {
    var status = root.querySelector("[data-share-status]");
    shareForm.addEventListener("submit", function (event) {
      event.preventDefault();
      var email = shareForm.querySelector('input[type="email"]').value.trim();
      if (!email) {
        if (status) status.textContent = text.needEmail;
        return;
      }
      var href =
        "mailto:" +
        encodeURIComponent(email) +
        "?subject=" +
        encodeURIComponent(text.subject) +
        "&body=" +
        encodeURIComponent(lastSummary);
      window.location.href = href;
      if (status) status.textContent = text.mailOpened;
    });
  }

  render();
})();
