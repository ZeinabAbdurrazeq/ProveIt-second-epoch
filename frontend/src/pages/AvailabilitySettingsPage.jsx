import { useEffect, useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Loader2Icon, SaveIcon, Trash2Icon, CalendarClockIcon } from "lucide-react";
import Navbar from "../components/Navbar";
import { availabilityApi } from "../api/availability";
import { useLanguage } from "../context/LanguageContext";
import { getTranslator } from "../lib/translations";
import {
  DAYS,
  getDayLabels,
  buildTimeRows,
  formatTimeLabel,
  scheduleToSelectedCells,
  selectedCellsToSchedule,
} from "../lib/availabilityGrid";

function AvailabilitySettingsPage() {
  const queryClient = useQueryClient();
  const { language } = useLanguage();
  const t = getTranslator(language);
  const dayLabels = getDayLabels(language);
  const timeRows = buildTimeRows();

  const [selectedCells, setSelectedCells] = useState(() => new Set());
  const selectedHours = (selectedCells.size / 2).toFixed(1);

  // Drag state: whether we are dragging, and whether the drag is selecting
  // or deselecting (decided by the first cell we touch).
  const isDraggingRef = useRef(false);
  const dragModeRef = useRef(true); // true = select, false = deselect
  const hydratedRef = useRef(false);

  const { data, isLoading } = useQuery({
    queryKey: ["myAvailability"],
    queryFn: availabilityApi.getMyAvailability,
  });

  // Pre-fill the grid from saved availability (only once).
  useEffect(() => {
    if (hydratedRef.current) return;
    if (isLoading) return;

    const schedule = data?.availability?.weeklySchedule;
    if (schedule) {
      setSelectedCells(scheduleToSelectedCells(schedule));
    }
    hydratedRef.current = true;
  }, [data, isLoading]);

  // End any drag if the mouse is released anywhere on the page.
  useEffect(() => {
    const stop = () => {
      isDraggingRef.current = false;
    };
    window.addEventListener("mouseup", stop);
    return () => window.removeEventListener("mouseup", stop);
  }, []);

  const cellKey = (day, time) => `${day}|${time}`;

  const applyCell = (day, time, mode) => {
    setSelectedCells((prev) => {
      const next = new Set(prev);
      const key = cellKey(day, time);
      if (mode) next.add(key);
      else next.delete(key);
      return next;
    });
  };

  const handleMouseDown = (day, time) => {
    const key = cellKey(day, time);
    const willSelect = !selectedCells.has(key);
    dragModeRef.current = willSelect;
    isDraggingRef.current = true;
    applyCell(day, time, willSelect);
  };

  const handleMouseEnter = (day, time) => {
    if (!isDraggingRef.current) return;
    applyCell(day, time, dragModeRef.current);
  };

  const saveMutation = useMutation({
    mutationFn: () =>
      availabilityApi.updateMyAvailability(selectedCellsToSchedule(selectedCells)),
    onSuccess: () => {
      toast.success(t("availability.saved"));
      queryClient.invalidateQueries({ queryKey: ["myAvailability"] });
    },
    onError: (error) =>
      toast.error(error.response?.data?.msg || t("availability.saveError")),
  });

  const handleClearAll = () => setSelectedCells(new Set());

  return (
    <div className="min-h-screen bg-base-300">
      <Navbar />

      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 rtl:sm:flex-row-reverse">
          <div className="flex items-center gap-3 rtl:flex-row-reverse rtl:text-right">
            <div className="p-2 bg-gradient-to-br from-primary to-secondary rounded-xl">
              <CalendarClockIcon className="size-6 text-white" />
            </div>
              <div>
                <h1 className="text-2xl font-black">{t("availability.title")}</h1>
                <p className="text-sm text-base-content/60">
                  {t("availability.subtitle")}
                </p>
            </div>
          </div>

          <div className="flex items-center gap-2 rtl:flex-row-reverse">
            <button
              className="btn btn-ghost btn-sm gap-2 rtl:flex-row-reverse"
              onClick={handleClearAll}
              disabled={saveMutation.isPending}
            >
              <Trash2Icon className="size-4" />
              {t("common.clearAll")}
            </button>
            <button
              className="btn btn-primary btn-sm gap-2 rtl:flex-row-reverse"
              onClick={() => saveMutation.mutate()}
              disabled={saveMutation.isPending}
            >
              {saveMutation.isPending ? (
                <Loader2Icon className="size-4 animate-spin" />
              ) : (
                <SaveIcon className="size-4" />
              )}
              {t("availability.save")}
            </button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
          <div className="space-y-6">
            <div className="card bg-base-100 border border-base-300 shadow-sm">
              <div className="card-body p-6">
                <h2 className="text-lg font-bold">{t("availability.summary")}</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                  <div className="rounded-2xl bg-base-200/60 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-base-content/50">
                      {t("availability.selectedBlocks")}
                    </p>
                    <p className="mt-2 text-3xl font-black">{selectedCells.size}</p>
                  </div>
                  <div className="rounded-2xl bg-base-200/60 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-base-content/50">
                      {t("availability.selectedHours")}
                    </p>
                    <p className="mt-2 text-3xl font-black">{selectedHours}</p>
                  </div>
                  <div className="rounded-2xl bg-base-200/60 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-base-content/50">
                      {t("availability.timezone")}
                    </p>
                    <p className="mt-2 text-lg font-semibold">Africa/Cairo</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card bg-base-100 border border-base-300 shadow-sm">
              <div className="card-body p-6">
                <h2 className="text-lg font-bold">{t("availability.howItWorks")}</h2>
                <ul className="mt-4 space-y-3 text-sm text-base-content/70">
                  <li>{t("availability.howItWorks1")}</li>
                  <li>{t("availability.howItWorks2")}</li>
                  <li>{t("availability.howItWorks3")}</li>
                  <li>{t("availability.howItWorks4")}</li>
                </ul>
              </div>
            </div>
          </div>

          {/* GRID */}
          {isLoading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2Icon className="size-10 animate-spin text-primary" />
            </div>
          ) : (
            <div className="card bg-base-100 border border-base-300 overflow-x-auto shadow-sm">
              <div className="card-body p-4">
                <div
                  className="select-none"
                  style={{ minWidth: "640px" }}
                >
                  {/* Header row of days */}
                  <div className="grid" style={{ gridTemplateColumns: "80px repeat(7, 1fr)" }}>
                    <div />
                    {DAYS.map((day) => (
                      <div
                        key={day}
                        className="text-center text-sm font-semibold py-2"
                      >
                      {dayLabels[day]}
                      </div>
                    ))}
                  </div>

                  {/* Time rows */}
                  {timeRows.map((time) => (
                    <div
                      key={time}
                      className="grid items-stretch"
                      style={{ gridTemplateColumns: "80px repeat(7, 1fr)" }}
                    >
                      <div className="text-right pr-2 text-xs text-base-content/60 py-1">
                        {time.endsWith(":00") ? formatTimeLabel(time, language) : ""}
                      </div>

                      {DAYS.map((day) => {
                        const selected = selectedCells.has(cellKey(day, time));
                        return (
                          <div
                            key={`${day}-${time}`}
                            onMouseDown={() => handleMouseDown(day, time)}
                            onMouseEnter={() => handleMouseEnter(day, time)}
                            className={`h-6 border border-base-300/60 cursor-pointer transition-colors ${
                              selected
                                ? "bg-success/80 hover:bg-success"
                                : "bg-base-200 hover:bg-base-300"
                            }`}
                            title={`${dayLabels[day]} ${formatTimeLabel(time, language)}`}
                          />
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AvailabilitySettingsPage;
