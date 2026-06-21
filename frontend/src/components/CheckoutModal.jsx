import { useState } from "react";
import { useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import {
  Loader2Icon,
  LockIcon,
  CheckCircle2Icon,
  XIcon,
} from "lucide-react";
import { subscriptionApi } from "../api/subscription";
import { PLANS } from "../data/plans";
import { useLanguage } from "../context/LanguageContext";
import { getTranslator } from "../lib/translations";

// Full checkout modal styled like a real payment page. Handles card input
// formatting, the simulated payment call, a decline shake, and a success state.
function CheckoutModal({ planKey, onClose }) {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = getTranslator(language);
  const plan = PLANS[planKey];

  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  const [success, setSuccess] = useState(false);

  const payMutation = useMutation({
    mutationFn: subscriptionApi.simulatePayment,
    onSuccess: () => {
      setError("");
      setSuccess(true);
    },
    onError: (err) => {
      setError(
        err.response?.data?.message || t("checkout.declined"),
      );
      setShake(true);
      setTimeout(() => setShake(false), 500);
    },
  });

  const formatCardNumber = (value) =>
    value
      .replace(/\D/g, "")
      .slice(0, 16)
      .replace(/(.{4})/g, "$1 ")
      .trim();

  const formatExpiry = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    if (digits.length <= 2) return digits;
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  };

  const handlePay = () => {
    setError("");
    payMutation.mutate({ cardNumber, plan: planKey });
  };

  if (success) {
    return (
      <div className="modal modal-open">
        <div className="modal-box text-center">
          <CheckCircle2Icon className="size-20 mx-auto text-success mb-4" />
          <h3 className="text-2xl font-bold mb-2">
            {t("checkout.welcome")} {plan.name}!
          </h3>
          <p className="text-base-content/70 mb-6">
            {t("checkout.successMessage")}
          </p>
          <button
            className="btn btn-primary w-full"
            onClick={() => navigate("/dashboard")}
          >
            {t("checkout.goToDashboard")}
          </button>
        </div>
        <div className="modal-backdrop" />
      </div>
    );
  }

  return (
    <div className="modal modal-open">
      <div
        className={`modal-box max-w-md ${shake ? "animate-[wiggle_0.4s_ease-in-out]" : ""}`}
        style={
          shake
            ? { animation: "shake 0.4s" }
            : undefined
        }
      >
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-3 top-3 rtl:right-auto rtl:left-3"
          onClick={onClose}
        >
          <XIcon className="size-4" />
        </button>

        {/* Inline keyframes for the shake effect */}
        <style>{`@keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-8px)}40%,80%{transform:translateX(8px)}}`}</style>

        <h3 className="font-bold text-xl mb-1">{plan.name} plan</h3>
        <p className="text-base-content/70 mb-4">
          ${plan.price.toFixed(2)} / month
        </p>

        {error && (
          <div className="alert alert-error mb-4 py-2 text-sm">{error}</div>
        )}

        <div className="space-y-3">
          <div>
            <label className="label">
              <span className="label-text">{t("checkout.cardNumber")}</span>
            </label>
            <input
              type="text"
              inputMode="numeric"
              className="input input-bordered w-full"
              placeholder="4242 4242 4242 4242"
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
            />
          </div>

          <div className="flex gap-3 rtl:flex-row-reverse">
            <div className="flex-1">
              <label className="label">
                <span className="label-text">{t("checkout.expiry")}</span>
              </label>
              <input
                type="text"
                inputMode="numeric"
                className="input input-bordered w-full"
                placeholder="MM/YY"
                value={expiry}
                onChange={(e) => setExpiry(formatExpiry(e.target.value))}
              />
            </div>
            <div className="flex-1">
              <label className="label">
                <span className="label-text">{t("checkout.cvv")}</span>
              </label>
              <input
                type="text"
                inputMode="numeric"
                className="input input-bordered w-full"
                placeholder="123"
                value={cvv}
                onChange={(e) =>
                  setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))
                }
              />
            </div>
          </div>

          <div>
            <label className="label">
              <span className="label-text">{t("checkout.cardholder")}</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full"
              placeholder="Name on card"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center justify-between mt-5 mb-3 rtl:flex-row-reverse">
          <span className="text-base-content/70">{t("checkout.totalToday")}</span>
          <span className="text-xl font-bold">${plan.price.toFixed(2)}</span>
        </div>

        <button
          className="btn btn-primary w-full gap-2 rtl:flex-row-reverse"
          onClick={handlePay}
          disabled={payMutation.isPending}
        >
          {payMutation.isPending ? (
            <Loader2Icon className="size-4 animate-spin" />
          ) : (
            <LockIcon className="size-4" />
          )}
          {t("checkout.payNow")}
        </button>

        <p className="flex items-center justify-center gap-1.5 text-xs text-base-content/50 mt-3">
          <LockIcon className="size-3" />
          {t("checkout.simulated")}
        </p>
      </div>
      <div className="modal-backdrop" onClick={onClose} />
    </div>
  );
}

export default CheckoutModal;
