// Shared model for the savings calculator (issue #52). Rendered into the page as the
// initial input values AND as a JSON blob that calculator.js reads, so the numbers in the
// copy and the numbers in the widget can never drift apart.
//
// The model is deliberately simple and every term is a visible input:
//
//   occupied bed-days  = beds x occupancy x 365
//   calls             = occupied bed-days x calls per patient-day
//   minutes lost      = calls x wasted minutes per call
//   annual saving CHF = minutes lost / 60 x nursing cost per hour
//
// Baseline assumptions come from Swiss federal hospital statistics plus PATON's own
// observation work: roughly 8 nurse calls per patient-day, of which about 2.5 minutes per
// call is spent on things a specific call would have avoided (walking back for equipment,
// fetching a differently qualified colleague, checking an accidental call).
module.exports = {
  defaults: {
    beds: 83,
    occupancy: 85,
    callsPerPatientDay: 8,
    wastedMinutesPerCall: 2.5,
    nursingCostPerHour: 62,
    // Indicative list price only, so the page can show "your cost vs our price".
    // TODO: replace with the confirmed commercial price before launch.
    patonCostPerBedPerYear: 900,
  },
  limits: {
    beds: { min: 1, max: 2000, step: 1 },
    occupancy: { min: 30, max: 100, step: 1 },
    callsPerPatientDay: { min: 1, max: 30, step: 0.5 },
    wastedMinutesPerCall: { min: 0.5, max: 15, step: 0.5 },
    nursingCostPerHour: { min: 20, max: 200, step: 1 },
    patonCostPerBedPerYear: { min: 0, max: 5000, step: 50 },
  },
  // Presets are starting points, not the only answers — every field stays editable.
  presets: [
    { id: "specialised", label: "Specialised clinic", beds: 25 },
    { id: "primary", label: "Primary care hospital", beds: 60 },
    { id: "rehab", label: "Rehabilitation clinic", beds: 83 },
    { id: "centre", label: "Centre-care hospital", beds: 296 },
  ],
};
