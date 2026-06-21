import { useState } from "react";
import { useNavigate } from "react-router";
import { useUser, SignInButton } from "@clerk/react";
import { CheckIcon, SparklesIcon } from "lucide-react";
import { PLANS } from "../data/plans";
import CheckoutModal from "../components/CheckoutModal";
import MarketingNav from "../components/MarketingNav";
import { useLanguage } from "../context/LanguageContext";
import { getTranslator } from "../lib/translations";

function PricingPage() {
  const navigate = useNavigate();
  const { isSignedIn } = useUser();
  const { language } = useLanguage();
  const t = getTranslator(language);
  const [checkoutPlan, setCheckoutPlan] = useState(null);

  const planOrder = ["free", "pro", "premium"];

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

  // Signed-in handler only. Signed-out users get a SignInButton instead,
  // so every "Get Started" opens the sign-in modal just like on the HomePage.
  const handleGetStarted = (planKey) => {
    if (planKey === "free") {
      navigate("/dashboard");
      return;
    }
    setCheckoutPlan(planKey);
  };

  return (
    <div className="min-h-screen bg-base-300">
      <MarketingNav />
      <div className="mx-auto max-w-7xl px-6 py-16">
        {/* HEADER */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black mb-3">{t("pricing.title")}</h1>
          <p className="text-lg text-base-content/60">
            {t("pricing.subtitle")}
          </p>
        </div>

        {/* PLAN CARDS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          {planOrder.map((key) => {
            const plan = PLANS[key];
            const recommended = plan.recommended;

            return (
              <div
                key={key}
                className={`card bg-base-100 relative ${
                  recommended
                    ? "border-2 border-primary shadow-2xl lg:scale-105 z-10"
                    : "border border-base-300"
                }`}
              >
                {recommended && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="badge badge-primary gap-1 py-3">
                      <SparklesIcon className="size-3" />
                      {t("pricing.mostPopular")}
                    </span>
                  </div>
                )}

                <div className="card-body">
                  <h2 className="text-2xl font-bold">{t(planNameKey[key])}</h2>
                  <div className="flex items-baseline gap-1 my-2">
                    <span className="text-4xl font-black">
                      ${plan.price.toFixed(2)}
                    </span>
                    <span className="text-base-content/60">{t("pricing.perMonth")}</span>
                  </div>

                  <ul className="space-y-3 my-6">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 rtl:flex-row-reverse rtl:text-right">
                        <CheckIcon className="size-5 text-success shrink-0 mt-0.5" />
                        <span className="text-sm">{t(planFeatureKey(feature) || feature)}</span>
                      </li>
                    ))}
                  </ul>

                  {isSignedIn ? (
                    <button
                      className={`btn w-full ${
                        recommended ? "btn-primary" : "btn-outline"
                      }`}
                      onClick={() => handleGetStarted(key)}
                    >
                      {t("pricing.getStarted")}
                    </button>
                  ) : (
                    <SignInButton mode="modal">
                      <button
                        className={`btn w-full ${
                          recommended ? "btn-primary" : "btn-outline"
                        }`}
                      >
                        {t("pricing.getStarted")}
                      </button>
                    </SignInButton>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {checkoutPlan && (
        <CheckoutModal
          planKey={checkoutPlan}
          onClose={() => setCheckoutPlan(null)}
        />
      )}

    </div>
  );
}

export default PricingPage;
