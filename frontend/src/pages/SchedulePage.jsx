import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  Loader2Icon,
  SearchIcon,
  SendIcon,
  UserIcon,
  CalendarIcon,
} from "lucide-react";
import Navbar from "../components/Navbar";
import { invitationApi } from "../api/invitations";
import { availabilityApi } from "../api/availability";
import { PROBLEMS } from "../data/problems";
import { useLanguage } from "../context/LanguageContext";
import { getTranslator } from "../lib/translations";
import {
  DAYS,
  getDayLabels,
  buildTimeRows,
  formatTimeLabel,
  scheduleToSelectedCells,
} from "../lib/availabilityGrid";

// Map a weekday name -> the next matching date (YYYY-MM-DD) from today,
// so a selected availability cell becomes a concrete scheduledDate.
function nextDateForDay(dayName) {
  const order = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  const target = order.indexOf(dayName);
  const today = new Date();
  const todayIdx = today.getDay();
  let diff = target - todayIdx;
  if (diff < 0) diff += 7;
  const date = new Date(today);
  date.setDate(today.getDate() + diff);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function useDebouncedValue(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

function SchedulePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { language } = useLanguage();
  const t = getTranslator(language);
  const dayLabels = getDayLabels(language);
  const problems = Object.values(PROBLEMS);
  const timeRows = buildTimeRows();

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 400);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedCell, setSelectedCell] = useState(null); // "day|HH:MM"

  const [problem, setProblem] = useState(problems[0]?.title || "");
  const [difficulty, setDifficulty] = useState("easy");
  const [message, setMessage] = useState("");

  const { data: searchData, isFetching: searching } = useQuery({
    queryKey: ["searchUsers", debouncedSearch],
    queryFn: () => invitationApi.searchUsers(debouncedSearch),
    enabled: debouncedSearch.trim().length > 0 && !selectedUser,
  });

  const { data: availabilityData, isLoading: loadingAvailability } = useQuery({
    queryKey: ["userAvailability", selectedUser?._id],
    queryFn: () => availabilityApi.getUserAvailability(selectedUser._id),
    enabled: !!selectedUser?._id,
  });

  const availableCells = useMemo(
    () => scheduleToSelectedCells(availabilityData?.weeklySchedule),
    [availabilityData],
  );

  const sendMutation = useMutation({
    mutationFn: invitationApi.sendInvitation,
    onSuccess: () => {
      toast.success(t("schedule.sent"));
      queryClient.invalidateQueries({ queryKey: ["myInvitations"] });
      navigate("/invitations");
    },
    onError: (error) =>
      toast.error(error.response?.data?.msg || t("schedule.sendError")),
  });

  const handleSend = () => {
    if (!selectedUser) return toast.error(t("schedule.selectUser"));
    if (!selectedCell) return toast.error(t("schedule.pickSlot"));
    if (!problem || !difficulty) return toast.error(t("schedule.chooseProblem"));

    const [day, time] = selectedCell.split("|");
    sendMutation.mutate({
      recipientId: selectedUser._id,
      scheduledDate: nextDateForDay(day),
      scheduledTime: time,
      problem,
      difficulty,
      message,
    });
  };

  const resetUser = () => {
    setSelectedUser(null);
    setSelectedCell(null);
    setSearch("");
  };

  return (
    <div className="min-h-screen bg-base-300">
      <Navbar />

      <div className="mx-auto max-w-7xl px-6 py-8">
        <h1 className="text-2xl font-black mb-2">{t("schedule.title")}</h1>
        <p className="text-sm text-base-content/60 mb-6">
          {t("schedule.description")}
        </p>

        <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
          <div className="space-y-6">
            <div className="card bg-base-100 border border-base-300 shadow-sm">
              <div className="card-body p-6">
                <label className="input input-bordered flex items-center gap-2">
                  <SearchIcon className="size-4 opacity-60" />
                  <input
                    type="text"
                    className="grow"
                    placeholder={t("schedule.searchPlaceholder")}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  {searching && <Loader2Icon className="size-4 animate-spin" />}
                </label>

                {searchData?.users?.length > 0 && (
                  <ul className="menu bg-base-200 rounded-box mt-3">
                    {searchData.users.map((u) => (
                      <li key={u._id}>
                        <button
                          className="flex items-center gap-3"
                          onClick={() => setSelectedUser(u)}
                        >
                          {u.profileImage ? (
                            <img
                              src={u.profileImage}
                              alt={u.name}
                              className="size-8 rounded-full"
                            />
                          ) : (
                            <span className="size-8 rounded-full bg-base-300 flex items-center justify-center">
                              <UserIcon className="size-4" />
                            </span>
                          )}
                          <div className="text-left">
                            <p className="font-medium">{u.name}</p>
                            <p className="text-xs opacity-60">{u.email}</p>
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                {debouncedSearch && !searching && searchData?.users?.length === 0 && (
                  <p className="text-sm opacity-60 mt-3">{t("schedule.noUsers")}</p>
                )}
              </div>
            </div>

            {selectedUser && (
              <div className="card bg-base-100 border border-base-300 shadow-sm">
                <div className="card-body flex-row items-center justify-between p-6">
                  <div className="flex items-center gap-3">
                    {selectedUser.profileImage ? (
                      <img
                        src={selectedUser.profileImage}
                        alt={selectedUser.name}
                        className="size-10 rounded-full"
                      />
                    ) : (
                      <span className="size-10 rounded-full bg-base-300 flex items-center justify-center">
                        <UserIcon className="size-5" />
                      </span>
                    )}
                    <div>
                      <p className="font-semibold">{selectedUser.name}</p>
                      <p className="text-xs opacity-60">{selectedUser.email}</p>
                    </div>
                  </div>
                  <button className="btn btn-ghost btn-sm" onClick={resetUser}>
                    {t("common.change")}
                  </button>
                </div>
              </div>
            )}

            <div className="card bg-base-100 border border-base-300 shadow-sm">
              <div className="card-body p-6">
                <h2 className="text-lg font-bold">{t("schedule.tips")}</h2>
                <ul className="mt-4 space-y-3 text-sm text-base-content/70">
                  <li>{t("schedule.tip1")}</li>
                  <li>{t("schedule.tip2")}</li>
                  <li>{t("schedule.tip3")}</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {selectedUser ? (
              <>
                <div className="card bg-base-100 border border-base-300 shadow-sm">
                  <div className="card-body p-6">
                    <h2 className="font-bold flex items-center gap-2 mb-3 rtl:flex-row-reverse">
                      <CalendarIcon className="size-4" />
                      {selectedUser.name} {t("schedule.availabilityOf")}
                    </h2>

                    {loadingAvailability ? (
                      <div className="flex items-center justify-center py-12">
                        <Loader2Icon className="size-8 animate-spin text-primary" />
                      </div>
                    ) : availableCells.size === 0 ? (
                      <p className="text-sm opacity-60 py-4">
                        {t("schedule.noAvailability")}
                      </p>
                    ) : (
                      <div className="overflow-x-auto">
                        <div className="select-none" style={{ minWidth: "640px" }}>
                          <div
                            className="grid"
                            style={{ gridTemplateColumns: "80px repeat(7, 1fr)" }}
                          >
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
                                const key = `${day}|${time}`;
                                const available = availableCells.has(key);
                                const picked = selectedCell === key;
                                return (
                                  <div
                                    key={key}
                                    onClick={() => available && setSelectedCell(key)}
                                    className={`h-6 border border-base-300/60 transition-colors ${
                                      picked
                                        ? "bg-primary"
                                        : available
                                          ? "bg-success/80 hover:bg-success cursor-pointer"
                                          : "bg-base-200"
                                    }`}
                                    title={
                                      available
                                        ? `${dayLabels[day]} ${formatTimeLabel(time, language)}`
                                        : ""
                                    }
                                  />
                                );
                              })}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedCell && (
                      <p className="text-sm mt-3">
                        {t("schedule.selected")}{" "}
                        <span className="font-semibold">
                          {dayLabels[selectedCell.split("|")[0]]}{" "}
                          {formatTimeLabel(selectedCell.split("|")[1], language)}
                        </span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="card bg-base-100 border border-base-300 shadow-sm">
                  <div className="card-body space-y-4 p-6">
                    <div>
                      <label className="label">
                        <span className="label-text font-semibold">{t("schedule.problem")}</span>
                      </label>
                      <select
                        className="select select-bordered w-full"
                        value={problem}
                        onChange={(e) => setProblem(e.target.value)}
                      >
                        {problems.map((p) => (
                          <option key={p.id} value={p.title}>
                            {p.title} ({p.difficulty})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="label">
                        <span className="label-text font-semibold">{t("schedule.difficulty")}</span>
                      </label>
                      <select
                        className="select select-bordered w-full"
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value)}
                      >
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                      </select>
                    </div>

                    <div>
                      <label className="label">
                        <span className="label-text font-semibold">
                          {t("schedule.message")}
                        </span>
                      </label>
                      <textarea
                        className="textarea textarea-bordered w-full"
                        rows={3}
                        placeholder={t("schedule.messagePlaceholder")}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                      />
                    </div>

                    <button
                      className="btn btn-primary gap-2 rtl:flex-row-reverse"
                      onClick={handleSend}
                      disabled={sendMutation.isPending}
                    >
                      {sendMutation.isPending ? (
                        <Loader2Icon className="size-4 animate-spin" />
                      ) : (
                        <SendIcon className="size-4" />
                      )}
                      {t("schedule.send")}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="card bg-base-100 border border-base-300 shadow-sm min-h-[520px]">
                <div className="card-body items-center justify-center text-center p-10">
                  <CalendarIcon className="size-12 text-primary/70" />
                  <h2 className="mt-4 text-xl font-bold">Pick a user to continue</h2>
                  <p className="mt-2 max-w-md text-sm text-base-content/60">
                    Search for a teammate on the left, then pick an available slot to
                    build the invitation.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SchedulePage;
