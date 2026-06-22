// Shared helpers for the weekly availability grid.
//
// The grid runs from 08:00 to 23:00 in 30-minute increments. Each row is a
// 30-minute cell; selecting a cell means "available during this half hour".
// Stored data uses contiguous {startTime, endTime} slots per day, so we
// convert between the two representations here.

export const DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

export const DAY_LABELS = {
  monday: "Mon",
  tuesday: "Tue",
  wednesday: "Wed",
  thursday: "Thu",
  friday: "Fri",
  saturday: "Sat",
  sunday: "Sun",
};

export function getDayLabels(language = "en") {
  if (String(language).toLowerCase().startsWith("ar")) {
    return {
      monday: "الاثنين",
      tuesday: "الثلاثاء",
      wednesday: "الأربعاء",
      thursday: "الخميس",
      friday: "الجمعة",
      saturday: "السبت",
      sunday: "الأحد",
    };
  }
  return DAY_LABELS;
}

export const START_HOUR = 8; // 08:00
export const END_HOUR = 23; // 23:00
export const SLOT_MINUTES = 30;

// Build the list of row times as "HH:MM" strings: 08:00, 08:30, ... 22:30.
// The last selectable cell starts at 22:30 and ends at 23:00.
export function buildTimeRows() {
  const rows = [];
  for (let h = START_HOUR; h < END_HOUR; h++) {
    rows.push(`${String(h).padStart(2, "0")}:00`);
    rows.push(`${String(h).padStart(2, "0")}:30`);
  }
  return rows;
}

export function addMinutes(hhmm, minutes) {
  const [h, m] = hhmm.split(":").map(Number);
  const total = h * 60 + m + minutes;
  const nh = Math.floor(total / 60);
  const nm = total % 60;
  return `${String(nh).padStart(2, "0")}:${String(nm).padStart(2, "0")}`;
}

// Format "HH:MM" (24h) into a friendly label like "8:00 AM".
export function formatTimeLabel(hhmm, language = "en") {
  const [h, m] = hhmm.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  if (String(language).toLowerCase().startsWith("ar")) {
    const arabicDigits = `${hour12}:${String(m).padStart(2, "0")}`
      .replace(/[0-9]/g, (d) => "٠١٢٣٤٥٦٧٨٩"[Number(d)]);
    return `${arabicDigits} ${period === "AM" ? "ص" : "م"}`;
  }
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
}

// Convert stored weeklySchedule slots -> a Set of "day|HH:MM" cell keys.
export function scheduleToSelectedCells(weeklySchedule) {
  const selected = new Set();
  if (!weeklySchedule) return selected;

  for (const day of DAYS) {
    const slots = weeklySchedule[day] || [];
    for (const slot of slots) {
      let t = slot.startTime;
      // Walk in 30-min steps from startTime up to (but not including) endTime.
      while (t < slot.endTime) {
        selected.add(`${day}|${t}`);
        t = addMinutes(t, SLOT_MINUTES);
      }
    }
  }
  return selected;
}

// Convert a Set of selected "day|HH:MM" cells -> a weeklySchedule object
// with contiguous cells merged into {startTime, endTime} slots.
export function selectedCellsToSchedule(selectedCells) {
  const rows = buildTimeRows();
  const schedule = {};

  for (const day of DAYS) {
    const slots = [];
    let runStart = null;
    let prev = null;

    for (const time of rows) {
      const isSelected = selectedCells.has(`${day}|${time}`);

      if (isSelected) {
        if (runStart === null) runStart = time;
        prev = time;
      } else if (runStart !== null) {
        slots.push({ startTime: runStart, endTime: addMinutes(prev, SLOT_MINUTES) });
        runStart = null;
        prev = null;
      }
    }

    // Close a run that reaches the end of the grid.
    if (runStart !== null) {
      slots.push({ startTime: runStart, endTime: addMinutes(prev, SLOT_MINUTES) });
    }

    schedule[day] = slots;
  }

  return schedule;
}
