import { useState } from "react";
import { Link } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { format } from "date-fns";
import {
  Loader2Icon,
  SparklesIcon,
  AlertTriangleIcon,
  XIcon,
} from "lucide-react";
import Navbar from "../components/Navbar";
import { subscriptionApi } from "../api/subscription";
import { PLANS } from "../data/plans";
import { useLanguage } from "../context/LanguageContext";
import { getTranslator } from "../lib/translations";

function planBadgeClass(plan) {
  if (plan === "pro") return "badge-primary";
  if (plan === "premium") return "badge-secondary";
  return "badge-ghost";
}

function SubscriptionPage() {
  const queryClient = useQueryClient();
  const { language } = useLanguage();
  const t = getTranslator(language);
  const [showCancel, setShowCancel] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["mySubscription"],
    queryFn: subscriptionApi.getMySubscription,
  });

  const cancelMutation = useMutation({
    mutationFn: subscriptionApi.cancelSubscription,
    onSuccess: () => {
      toast.success(t("subscription.cancelled"));
      queryClient.invalidateQueries({ queryKey: ["mySubscription"] });
      setShowCancel(false);
    },
    onError: (error) =>
      toast.error(error.response?.data?.msg || t("subscription.cancelError")),
  });

  const subscription = data?.subscription;
  const planKey = subscription?.plan || "free";
  const plan = PLANS[planKey];
  const planNameKey = {
    free: "plans.freeName",
    pro: "plans.proName",
    premium: "plans.premiumName",
  };
  const planFeatureKey = (feature) => {
    const map = {
      free: {
        "3 AI interviews per month": "plans.free.feature1",
        "Access to live sessions": "plans.free.feature2",
        "Basic progress tracking": "plans.free.feature3",
        "Community problems": "plans.free.feature4",
      },
      pro: {
        "Unlimited AI interviews": "plans.pro.feature1",
        "Full progress tracking and candidate profile": "plans.pro.feature2",
        "Detailed scorecards": "plans.pro.feature3",
        "Priority problem matching": "plans.pro.feature4",
        "Invite and scheduling system": "plans.pro.feature5",
        "Everything in Free": "plans.pro.feature6",
      },
      premium: {
        "Everything in Pro": "plans.premium.feature1",
        "Unlimited CV re-uploads": "plans.premium.feature2",
        "Advanced analytics": "plans.premium.feature3",
        "Early access to new features": "plans.premium.feature4",
        "Priority support": "plans.premium.feature5",
      },
    };
    for (const key of Object.keys(map)) {
      if (map[key][feature]) return map[key][feature];
    }
    return null;
  };
  const isFree = planKey === "free";
  const used = subscription?.aiInterviewsUsedThisMonth || 0;

  return (
    <div className="min-h-screen bg-base-300">
      <Navbar />

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-black">{t("subscription.title")}</h1>
          <p className="text-sm text-base-content/60">
            {t("subscription.description")}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
          <div className="space-y-6">
            {isLoading ? (
              <div className="card bg-base-100 border border-base-300 shadow-sm">
                <div className="card-body items-center justify-center py-20">
                  <Loader2Icon className="size-10 animate-spin text-primary" />
                </div>
              </div>
            ) : (
              <div className="card bg-base-100 border border-base-300 shadow-sm">
                <div className="card-body space-y-5 p-6">
                  <div className="flex items-center justify-between rtl:flex-row-reverse">
                    <div>
                      <p className="text-sm text-base-content/60">
                        {t("subscription.currentPlan")}
                      </p>
                      <div className="flex items-center gap-2 mt-1 rtl:flex-row-reverse">
                        <span className="text-xl font-bold">{t(planNameKey[planKey])}</span>
                        <span className={`badge ${planBadgeClass(planKey)}`}>
                          {subscription?.status}
                        </span>
                      </div>
                    </div>
                    {plan && (
                      <span className="text-lg font-semibold">
                        ${plan.price.toFixed(2)}/mo
                      </span>
                    )}
                  </div>

                  {subscription?.currentPeriodEnd && (
                    <div className="rounded-2xl bg-base-200/60 p-4">
                      <p className="text-sm text-base-content/60">
                        {subscription.status === "cancelled"
                          ? t("subscription.accessUntil")
                          : t("subscription.renews")}
                      </p>
                      <p className="mt-1 font-medium">
                        {format(
                          new Date(subscription.currentPeriodEnd),
                          "MMMM d, yyyy",
                        )}
                      </p>
                    </div>
                  )}

                  {isFree && (
                    <div>
                      <div className="flex justify-between text-sm mb-1 rtl:flex-row-reverse">
                        <span className="text-base-content/60">
                          {t("subscription.usage")}
                        </span>
                        <span className="font-medium">{used} / 3</span>
                      </div>
                      <progress
                        className="progress progress-primary w-full"
                        value={Math.min(used, 3)}
                        max="3"
                      />
                    </div>
                  )}

                  <div className="pt-2 flex flex-wrap gap-3">
                    {planKey !== "premium" ? (
                      <Link to="/pricing" className="btn btn-primary gap-2 rtl:flex-row-reverse">
                        <SparklesIcon className="size-4" />
                        {t("subscription.upgrade")}
                      </Link>
                    ) : null}

                    {!isFree && subscription?.status === "active" && (
                      <button
                        className="btn btn-ghost text-error"
                        onClick={() => setShowCancel(true)}
                      >
                        {t("subscription.cancel")}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {!isLoading && (
            <div className="space-y-6">
              <div className="card bg-base-100 border border-base-300 shadow-sm">
                <div className="card-body p-6">
                  <h2 className="text-lg font-bold">{t("subscription.planFeatures")}</h2>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {plan?.features?.map((feature) => (
                      <div
                        key={feature}
                        className="rounded-2xl bg-base-200/60 p-4 text-sm text-base-content/80"
                      >
                        {t(planFeatureKey(feature) || feature)}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
              <div className="card bg-base-100 border border-base-300 shadow-sm">
                  <div className="card-body p-6">
                    <h3 className="font-bold">{t("subscription.upgradePath")}</h3>
                    <p className="mt-2 text-sm text-base-content/60">
                      {t("subscription.upgradePathBody")}
                    </p>
                  </div>
                </div>
                <div className="card bg-base-100 border border-base-300 shadow-sm">
                  <div className="card-body p-6">
                    <h3 className="font-bold">{t("subscription.needReset")}</h3>
                    <p className="mt-2 text-sm text-base-content/60">
                      {t("subscription.needResetBody")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )} 
        </div>
      </div>

      {/* CANCEL CONFIRMATION */}
      {showCancel && (
        <div className="modal modal-open">
          <div className="modal-box">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-3 top-3"
              onClick={() => setShowCancel(false)}
            >
              <XIcon className="size-4" />
            </button>
            <div className="flex items-start gap-3 rtl:flex-row-reverse rtl:text-right">
              <AlertTriangleIcon className="size-6 text-warning shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-lg">{t("subscription.cancelConfirm")}</h3>
                <p className="text-sm text-base-content/70 mt-1">
                  {t("subscription.cancelNote")}
                </p>
              </div>
            </div>
            <div className="modal-action">
              <button
                className="btn btn-ghost"
                onClick={() => setShowCancel(false)}
              >
                {t("subscription.keepPlan")}
              </button>
              <button
                className="btn btn-error gap-2 rtl:flex-row-reverse"
                onClick={() => cancelMutation.mutate()}
                disabled={cancelMutation.isPending}
              >
                {cancelMutation.isPending && (
                  <Loader2Icon className="size-4 animate-spin" />
                )}
                {t("subscription.cancel")}
              </button>
            </div>
          </div>
          <div className="modal-backdrop" />
        </div>
      )}
    </div>
  );
}

export default SubscriptionPage;
