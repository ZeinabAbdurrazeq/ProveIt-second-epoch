import { useState, useRef, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { formatDistanceToNow } from "date-fns";
import {
  BellIcon,
  CheckIcon,
  XIcon,
  CheckCheckIcon,
  Loader2Icon,
} from "lucide-react";
import { notificationApi } from "../api/notifications";
import { invitationApi } from "../api/invitations";
import { useLanguage } from "../context/LanguageContext";
import { getTranslator } from "../lib/translations";

function NotificationBell() {
  const queryClient = useQueryClient();
  const { language } = useLanguage();
  const t = getTranslator(language);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { data } = useQuery({
    queryKey: ["notifications"],
    queryFn: notificationApi.getMyNotifications,
    refetchInterval: 30000,
  });

  const notifications = data?.notifications || [];
  const unreadCount = data?.unreadCount || 0;
  const recent = notifications.slice(0, 10);

  // Close the dropdown on outside click.
  useEffect(() => {
    const onClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const refetchAll = () => {
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
    queryClient.invalidateQueries({ queryKey: ["myInvitations"] });
    queryClient.invalidateQueries({ queryKey: ["pendingInvitationsCount"] });
  };

  const markAllMutation = useMutation({
    mutationFn: notificationApi.markAllAsRead,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const respondMutation = useMutation({
    mutationFn: invitationApi.respondToInvitation,
    onSuccess: (_data, variables) => {
      toast.success(
        variables.action === "accepted"
          ? "Invitation accepted!"
          : "Invitation declined.",
      );
      refetchAll();
    },
    onError: (error) =>
      toast.error(error.response?.data?.msg || "Failed to respond"),
  });

  const handleRespond = async (notification, action) => {
    if (!notification.relatedInvitationId) return;
    // Mark the notification read, then respond.
    try {
      await notificationApi.markAsRead(notification._id);
    } catch {
      /* non-fatal */
    }
    respondMutation.mutate({
      invitationId: notification.relatedInvitationId,
      action,
    });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="btn btn-ghost btn-circle"
        onClick={() => setOpen((o) => !o)}
        aria-label="Notifications"
      >
        <div className="indicator">
          <BellIcon className="size-5" />
          {unreadCount > 0 && (
            <span className="badge badge-error badge-xs indicator-item">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </div>
      </button>

      {open && (
        <div className="absolute right-0 rtl:right-auto rtl:left-0 mt-2 w-80 bg-base-100 border border-base-300 rounded-box shadow-xl z-50">
          <div className="flex items-center justify-between p-3 border-b border-base-300 rtl:flex-row-reverse">
            <span className="font-semibold">{t("notifications.title")}</span>
            <button
              className="btn btn-ghost btn-xs gap-1 rtl:flex-row-reverse"
              onClick={() => markAllMutation.mutate()}
              disabled={markAllMutation.isPending || unreadCount === 0}
            >
              <CheckCheckIcon className="size-3.5" />
              {t("notifications.markAllRead")}
            </button>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {recent.length === 0 ? (
              <p className="text-sm opacity-60 text-center py-8">
                {t("notifications.none")}
              </p>
            ) : (
              recent.map((n) => (
                <div
                  key={n._id}
                  className={`p-3 border-b border-base-200 ${
                    n.status === "unread" ? "bg-primary/5" : ""
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {n.status === "unread" && (
                      <span className="size-2 rounded-full bg-primary mt-1.5 shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm">{n.message}</p>
                      <p className="text-xs opacity-50 mt-1">
                        {formatDistanceToNow(new Date(n.createdAt), {
                          addSuffix: true,
                        })}
                      </p>

                      {n.type === "session-invitation" &&
                        n.relatedInvitationId &&
                        n.status === "unread" && (
                          <div className="flex gap-2 mt-2 rtl:flex-row-reverse">
                            <button
                              className="btn btn-success btn-xs gap-1 rtl:flex-row-reverse"
                              onClick={() => handleRespond(n, "accepted")}
                              disabled={respondMutation.isPending}
                            >
                              {respondMutation.isPending ? (
                                <Loader2Icon className="size-3 animate-spin" />
                              ) : (
                                <CheckIcon className="size-3" />
                              )}
                              {t("common.accept")}
                            </button>
                            <button
                              className="btn btn-error btn-xs gap-1 rtl:flex-row-reverse"
                              onClick={() => handleRespond(n, "declined")}
                              disabled={respondMutation.isPending}
                            >
                              <XIcon className="size-3" />
                              {t("common.decline")}
                            </button>
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationBell;
