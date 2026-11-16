import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Clock, Check } from "lucide-react";

const WEEKDAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];
const OPEN_HOUR = 9; // 9:00 AM
const CLOSE_HOUR = 19; // site visits bookable up to 7:00 PM
const SLOT_MINUTES = 30;
const MAX_MONTHS_AHEAD = 2;

function startOfDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

// Mon–Sun 6x7 grid for the given month, with leading/trailing days from
// adjacent months included (greyed out) so the grid is always visually
// complete — a real calendar, not a scrollable list of date chips.
function buildMonthGrid(year, month) {
  const first = new Date(year, month, 1);
  const gridStart = new Date(first);
  gridStart.setDate(first.getDate() - first.getDay());

  const weeks = [];
  const cursor = new Date(gridStart);
  for (let w = 0; w < 6; w++) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      week.push({ date: new Date(cursor), inMonth: cursor.getMonth() === month });
      cursor.setDate(cursor.getDate() + 1);
    }
    weeks.push(week);
  }
  return weeks;
}

// Quick-pick suggestions — every 30 minutes within business hours for the
// given day. When the day is today, anything at or before the current time
// is excluded. These are shortcuts, not the only option — see the exact
// time input below, which is the real "pick any time" control.
function buildTimeSlots(day) {
  const now = new Date();
  const slots = [];
  const cursor = new Date(day);
  cursor.setHours(OPEN_HOUR, 0, 0, 0);
  const close = new Date(day);
  close.setHours(CLOSE_HOUR, 0, 0, 0);

  while (cursor < close) {
    if (cursor > now) slots.push(new Date(cursor));
    cursor.setMinutes(cursor.getMinutes() + SLOT_MINUTES);
  }
  return slots;
}

function minTimeForDay(day, today) {
  if (!isSameDay(day, today)) return `${String(OPEN_HOUR).padStart(2, "0")}:00`;
  const now = new Date();
  // Round up to the next minute so "now" itself can never be selected.
  const next = new Date(now.getTime() + 60000);
  return `${String(next.getHours()).padStart(2, "0")}:${String(next.getMinutes()).padStart(2, "0")}`;
}

const timeLabel = (d) => d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
const monthLabel = (d) => d.toLocaleDateString("en-US", { month: "long", year: "numeric" });

// Shades of Green-themed date + time picker for the "Book a Site Visit"
// step. A real month-view calendar, quick-pick time chips for convenience,
// and a native time input for genuinely free choice of any minute — not
// limited to the suggested slots. The calendar/time area scrolls within a
// fixed height so "Confirm visit slot" is always reachable regardless of
// how tall the grid + slot list get (a real bug in the previous version:
// the button could be clipped by the chat window's fixed height).
export default function SiteVisitScheduler({ onConfirm }) {
  const today = useMemo(() => startOfDay(new Date()), []);
  const [viewDate, setViewDate] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null); // Date, or null
  const [customTimeStr, setCustomTimeStr] = useState(""); // "HH:MM" from the native input
  const [timeError, setTimeError] = useState(null);

  const weeks = useMemo(() => buildMonthGrid(viewDate.getFullYear(), viewDate.getMonth()), [viewDate]);
  const timeSlots = useMemo(() => (selectedDay ? buildTimeSlots(selectedDay) : []), [selectedDay]);

  const earliestMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const latestMonth = new Date(today.getFullYear(), today.getMonth() + MAX_MONTHS_AHEAD, 1);
  const canGoPrev = viewDate > earliestMonth;
  const canGoNext = viewDate < latestMonth;

  const changeMonth = (delta) => setViewDate((d) => new Date(d.getFullYear(), d.getMonth() + delta, 1));

  const pickDay = (date, inMonth) => {
    if (!inMonth || date < today) return;
    setSelectedDay(date);
    setSelectedTime(null);
    setCustomTimeStr("");
    setTimeError(null);
  };

  const pickSlot = (t) => {
    setSelectedTime(t);
    setCustomTimeStr(`${String(t.getHours()).padStart(2, "0")}:${String(t.getMinutes()).padStart(2, "0")}`);
    setTimeError(null);
  };

  const onCustomTimeChange = (value) => {
    setCustomTimeStr(value);
    setTimeError(null);
    if (!value || !selectedDay) {
      setSelectedTime(null);
      return;
    }
    const [h, m] = value.split(":").map(Number);
    const candidate = new Date(selectedDay);
    candidate.setHours(h, m, 0, 0);

    if (h < OPEN_HOUR || h >= CLOSE_HOUR) {
      setTimeError(`Please pick a time between ${OPEN_HOUR}:00 AM and 7:00 PM.`);
      setSelectedTime(null);
      return;
    }
    if (candidate <= new Date()) {
      setTimeError("That time has already passed — please pick a later time.");
      setSelectedTime(null);
      return;
    }
    setSelectedTime(candidate);
  };

  const canConfirm = Boolean(selectedDay && selectedTime && !timeError);

  return (
    <div>
      <div className="bg-gray-50 border border-gray-100 rounded-2xl p-3.5">
        {/* No inner scroll region here on purpose — ChatWindow.jsx's own
            message log is already the one shared scrollable area this
            entire component lives inside (see the comment there). A second,
            smaller scrollbox nested inside it was a real, reported bug: on
            a full-height mobile chat window especially, a visitor would see
            only 2-3 calendar rows, assume the widget was stuck or still
            loading, and never discover the tiny inner scroll zone was what
            needed scrolling instead of the page. Letting this content flow
            naturally means the same outer scroll that already reveals
            quick-reply buttons also reveals the rest of the calendar and
            the Confirm button below, with nothing hidden behind a second,
            undiscoverable scroll boundary. */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <button
              type="button"
              onClick={() => changeMonth(-1)}
              disabled={!canGoPrev}
              aria-label="Previous month"
              className="w-7 h-7 rounded-lg flex items-center justify-center text-[#1A4744] hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold text-[#1A4744]">{monthLabel(viewDate)}</span>
            <button
              type="button"
              onClick={() => changeMonth(1)}
              disabled={!canGoNext}
              aria-label="Next month"
              className="w-7 h-7 rounded-lg flex items-center justify-center text-[#1A4744] hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-1">
            {WEEKDAY_LABELS.map((w, i) => (
              <div key={i} className="text-center text-[10px] font-bold text-gray-400">
                {w}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {weeks.flat().map(({ date, inMonth }, i) => {
              const disabled = !inMonth || date < today;
              const isToday = isSameDay(date, today);
              const isSelected = selectedDay && isSameDay(date, selectedDay);
              return (
                <button
                  key={i}
                  type="button"
                  disabled={disabled}
                  onClick={() => pickDay(date, inMonth)}
                  className={`aspect-square rounded-lg text-xs font-semibold flex items-center justify-center transition-colors relative ${
                    isSelected
                      ? "bg-[#1A4744] text-white"
                      : disabled
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-gray-700 hover:bg-white"
                  }`}
                >
                  {date.getDate()}
                  {isToday && !isSelected && (
                    <span className="absolute bottom-0.5 w-1 h-1 rounded-full bg-emerald-500" />
                  )}
                </button>
              );
            })}
          </div>

          {selectedDay && (
            <>
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#1A4744] mt-3.5 mb-2">
                <Clock className="w-3.5 h-3.5" />
                {selectedDay.toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long" })}
              </div>

              {timeSlots.length > 0 && (
                <>
                  <p className="text-[11px] text-gray-500 mb-1.5">Quick pick:</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {timeSlots.map((t) => {
                      const active = selectedTime && selectedTime.getTime() === t.getTime();
                      return (
                        <button
                          key={t.getTime()}
                          type="button"
                          onClick={() => pickSlot(t)}
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                            active
                              ? "bg-emerald-600 text-white"
                              : "bg-white text-gray-700 border border-gray-200 hover:border-emerald-400"
                          }`}
                        >
                          {timeLabel(t)}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}

              <label className="block text-[11px] text-gray-500 mb-1.5" htmlFor="sog-visit-time">
                Or choose any time:
              </label>
              <input
                id="sog-visit-time"
                type="time"
                value={customTimeStr}
                min={minTimeForDay(selectedDay, today)}
                max={`${String(CLOSE_HOUR).padStart(2, "0")}:00`}
                onChange={(e) => onCustomTimeChange(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
              />
              {timeError && <p className="text-xs text-red-600 mt-1.5">{timeError}</p>}
            </>
          )}
        </div>

        <button
          type="button"
          disabled={!canConfirm}
          onClick={() => canConfirm && onConfirm(selectedTime)}
          className="mt-3.5 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#1A4744] text-white text-sm font-semibold hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <Check className="w-4 h-4" />
          Confirm visit slot
        </button>
      </div>
    </div>
  );
}
