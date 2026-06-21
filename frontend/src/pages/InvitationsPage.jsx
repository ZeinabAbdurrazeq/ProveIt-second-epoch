import { useState } from "react";
import { Link } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { formatDistanceToNow } from "date-fns";
import {
  Loader2Icon,
  CheckIcon,
  XIcon,
  InboxIcon,
  SendIcon,
  VideoIcon,
} from "lucide-react";
import Navbar from "../components/Navbar";
import { invitationApi } from "../api/invitations";
import { getDifficultyBadgeClass } from "../lib/utils";
import { useLanguage } from "../context/LanguageContext";
import { getTranslator } from "../lib/translations";

function StatusBadge({ status }) {
  const map = {
    pending: "badge-warning",
    accepted: "badge-success",
    declined: "badge-error",
  };
  return (
    <span className={`badge ${map[status] || "badge-ghost"}`}>{status}</span>
  );
}

function InvitationsPage() {
  const queryClient = useQueryClient();
  const { language } = useLanguage();
  const t = getTranslator(language);
  const [tab, setTab] = useState("received");
  const [respondingId, setRespondingId] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ["myInvitations"],
    queryFn: invitationApi.getMyInvitations,
  });

  const respondMutation = useMutation({
    mutationFn: invitationApi.respondToInvitation,
    onSuccess: (_data, variables) => {
      toast.success(
        variables.action === "accepted"
          ? t("invitations.accepted")
          : t("invitations.declined"),
      );
      queryClient.invalidateQueries({ queryKey: ["myInvitations"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["pendingInvitationsCount"] });
    },
    onError: (error) =>
      toast.error(error.response?.data?.msg || t("invitations.respondError")),
    onSettled: () => setRespondingId(null),
  });

  const respond = (invitationId, action) => {
    setRespondingId(`${invitationId}-${action}`);
    respondMutation.mutate({ invitationId, action });
  };

  const invitations = data?.invitations || [];
  const pendingCount = invitations.filter((inv) => inv.status === "pending").length;

  // The backend tags every invitation with a reliable `direction` flag
  // ("sent" or "received") computed from the current user's id.
  const received = invitations.filter((inv) => inv.direction === "received");
  const sent = invitations.filter((inv) => inv.direction === "sent");

  const list = tab === "received" ? received : sent;

  const getSessionStatus = (inv) => {
    if (!inv?.sessionId) return null;
    if (typeof inv.sessionId === "object") return inv.sessionId.status || null;
    return null;
  };

  const renderCard = (inv) => {
    const isPending = inv.status === "pending";
    const sessionStatus = getSessionStatus(inv);
    const person = tab === "received" ? inv.senderId : inv.recipientId;

    return (
      <div
        key={inv._id}
        className="card bg-base-100 border border-base-300"
      >
        <div className="card-body">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              {person?.profileImage ? (
                <img
                  src={person.profileImage}
                  alt={person.name}
                  className="size-10 rounded-full"
                />
              ) : (
                <span className="size-10 rounded-full bg-base-300" />
              )}
              <div>
                <p className="font-semibold">{person?.name || "Unknown"}</p>
                <p className="text-xs opacity-60">
                  {formatDistanceToNow(new Date(inv.createdAt), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </div>
            <StatusBadge status={inv.status} />
          </div>

          <div className="flex items-center gap-2 mt-2">
            <span className="font-medium">{inv.problem}</span>
            <span className={`badge badge-sm ${getDifficultyBadgeClass(inv.difficulty)}`}>
              {inv.difficulty}
            </span>
          </div>

          <p className="text-sm opacity-80">
            {inv.scheduledDate} at {inv.scheduledTime} (Egypt)
          </p>

          {inv.message && (
            <p className="text-sm bg-base-200 rounded-lg p-3 mt-1">
              “{inv.message}”
            </p>
          )}

          {/* Received + pending: Accept / Decline */}
          {tab === "received" && isPending && (
            <div className="flex gap-2 mt-3 rtl:flex-row-reverse">
              <button
                className="btn btn-success btn-sm gap-2 rtl:flex-row-reverse"
                onClick={() => respond(inv._id, "accepted")}
                disabled={respondMutation.isPending}
              >
                {respondingId === `${inv._id}-accepted` ? (
                  <Loader2Icon className="size-4 animate-spin" />
                ) : (
                  <CheckIcon className="size-4" />
                )}
                {t("common.accept")}
              </button>
              <button
                className="btn btn-error btn-sm gap-2 rtl:flex-row-reverse"
                onClick={() => respond(inv._id, "declined")}
                disabled={respondMutation.isPending}
              >
                {respondingId === `${inv._id}-declined` ? (
                  <Loader2Icon className="size-4 animate-spin" />
                ) : (
                  <XIcon className="size-4" />
                )}
                {t("common.decline")}
              </button>
            </div>
          )}

          {/* Sent + accepted: Join Session while active, otherwise show done. */}
          {tab === "sent" && inv.status === "accepted" && inv.sessionId && (
            sessionStatus === "active" ? (
              <Link
                to={`/session/${
                  typeof inv.sessionId === "object"
                    ? inv.sessionId._id
                    : inv.sessionId
                }`}
                className="btn btn-primary btn-sm gap-2 mt-3 w-fit rtl:flex-row-reverse"
              >
                <VideoIcon className="size-4" />
                {t("invitations.join")}
              </Link>
            ) : (
              <div className="badge badge-success badge-outline mt-3">
                {t("invitations.completed")}
              </div>
            )
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-base-300">
      <Navbar />

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-black">{t("invitations.title")}</h1>
          <p className="text-sm text-base-content/60">
            {t("invitations.description")}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <div className="space-y-6">
            <div className="card bg-base-100 border border-base-300 shadow-sm">
              <div className="card-body p-6">
                <h2 className="text-lg font-bold">{t("invitations.overview")}</h2>
                <div className="mt-4 grid gap-3">
                  <div className="rounded-2xl bg-base-200/60 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-base-content/50">
                      {t("invitations.receivedLabel")}
                    </p>
                    <p className="mt-2 text-3xl font-black">{received.length}</p>
                  </div>
                  <div className="rounded-2xl bg-base-200/60 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-base-content/50">
                      {t("invitations.sentLabel")}
                    </p>
                    <p className="mt-2 text-3xl font-black">{sent.length}</p>
                  </div>
                  <div className="rounded-2xl bg-base-200/60 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-base-content/50">
                      {t("invitations.pendingLabel")}
                    </p>
                    <p className="mt-2 text-3xl font-black">{pendingCount}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card bg-base-100 border border-base-300 shadow-sm">
              <div className="card-body p-6">
                <h2 className="text-lg font-bold">{t("invitations.statusGuide")}</h2>
                <ul className="mt-4 space-y-3 text-sm text-base-content/70">
                  <li>{t("invitations.statusGuide1")}</li>
                  <li>{t("invitations.statusGuide2")}</li>
                  <li>{t("invitations.statusGuide3")}</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <div role="tablist" className="tabs tabs-boxed mb-6 w-fit rtl:flex-row-reverse">
              <button
                role="tab"
                className={`tab gap-2 ${tab === "received" ? "tab-active" : ""}`}
                onClick={() => setTab("received")}
              >
                <InboxIcon className="size-4" />
                {t("invitations.received")}
              </button>
              <button
                role="tab"
                className={`tab gap-2 ${tab === "sent" ? "tab-active" : ""}`}
                onClick={() => setTab("sent")}
              >
                <SendIcon className="size-4" />
                {t("invitations.sent")}
              </button>
            </div>

            <div className="card bg-base-100 border border-base-300 shadow-sm">
              <div className="card-body p-6">
                {isLoading ? (
                  <div className="flex items-center justify-center py-20">
                    <Loader2Icon className="size-10 animate-spin text-primary" />
                  </div>
                ) : list.length === 0 ? (
                  <p className="text-center opacity-60 py-16">
                    {t("invitations.none")}
                  </p>
                ) : (
                  <div className="space-y-4">{list.map(renderCard)}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InvitationsPage;
