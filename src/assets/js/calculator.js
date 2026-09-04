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
    set("hoursLost", chf.format(result.hoursLost) + " h");
    set("calls", chf.format(result.calls));
    set("bedDays", chf.format(result.occupiedBedDays));
    set("patonCost", "CHF " + chf.format(result.patonCost));
    set("grossSaving", "CHF " + chf.format(result.annualSaving));
    set("netBenefit", "CHF " + chf.format(result.netBenefit));
    set(
      "ratio",
      result.ratio === null
        ? "—"
        : decimal.format(result.ratio) + "× the indicative cost"
    );
    set("minutesPerBedPerDay", decimal.format(result.minutesPerBedPerDay) + " minutes");

    // Field read-outs next to each slider.
    set("bedsValue", chf.format(input.beds));
    set("occupancyValue", chf.format(input.occupancy) + "%");
    set("callsPerPatientDayValue", decimal.format(input.callsPerPatientDay));
    set("wastedMinutesPerCallValue", decimal.format(input.wastedMinutesPerCall) + " min");
    set("nursingCostPerHourValue", "CHF " + chf.format(input.nursingCostPerHour));
    set("patonCostPerBedPerYearValue", "CHF " + chf.format(input.patonCostPerBedPerYear));

    syncPresets(input.beds);

    lastSummary = [
      "PATON — indicative savings estimate",
      "",
      "Your inputs",
      "  Beds: " + chf.format(input.beds),
      "  Occupancy: " + chf.format(input.occupancy) + "%",
      "  Calls per patient-day: " + decimal.format(input.callsPerPatientDay),
      "  Time lost per call: " + decimal.format(input.wastedMinutesPerCall) + " minutes",
      "  Nursing cost per hour: CHF " + chf.format(input.nursingCostPerHour),
      "  Indicative PATON cost per bed per year: CHF " +
        chf.format(input.patonCostPerBedPerYear),
      "",
      "Modelled result per year",
      "  Nurse calls: " + chf.format(result.calls),
      "  Nursing time currently lost: " + chf.format(result.hoursLost) + " hours",
      "  Value of that time: CHF " + chf.format(result.annualSaving),
      "  Indicative PATON cost: CHF " + chf.format(result.patonCost),
      "  Net benefit: CHF " + chf.format(result.netBenefit),
      "  Time handed back per bed per day: " +
        decimal.format(result.minutesPerBedPerDay) +
        " minutes",
      "",
      "This is a model, not a quote. Assumptions and formula: " +
        window.location.origin +
        "/savings-calculator/",
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
        if (status) status.textContent = "Add an email address first.";
        return;
      }
      var href =
        "mailto:" +
        encodeURIComponent(email) +
        "?subject=" +
        encodeURIComponent("PATON — indicative savings estimate") +
        "&body=" +
        encodeURIComponent(lastSummary);
      window.location.href = href;
      if (status) {
        status.textContent =
          "Your email app should open with the summary. Nothing was sent to us.";
      }
    });
  }

  render();
})();
