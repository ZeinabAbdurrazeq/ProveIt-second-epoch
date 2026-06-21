import { useNavigate } from "react-router";
import { LockIcon, XIcon, SparklesIcon } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { getTranslator } from "../lib/translations";

// Reusable paywall shown when a free user hits their AI interview limit.
// TODO: Connect to AI Interview start endpoint when feature is built
function PaywallModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = getTranslator(language);

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box text-center max-w-md rtl:text-right">
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-3 top-3 rtl:right-auto rtl:left-3"
          onClick={onClose}
        >
          <XIcon className="size-4" />
        </button>

        <div className="size-16 mx-auto rounded-full bg-warning/15 flex items-center justify-center mb-4">
          <LockIcon className="size-8 text-warning" />
        </div>

        <h3 className="text-2xl font-bold mb-2 text-center">
          {t("paywall.title")}
        </h3>
        <p className="text-base-content/70 mb-6 text-center">
          {t("paywall.message")}
        </p>

        <button
          className="btn btn-primary w-full gap-2 mb-2 rtl:flex-row-reverse"
          onClick={() => navigate("/pricing")}
        >
          <SparklesIcon className="size-4" />
          {t("paywall.upgrade")}
        </button>
        <button className="btn btn-ghost w-full" onClick={onClose}>
          {t("paywall.later")}
        </button>
      </div>
      <div className="modal-backdrop" onClick={onClose} />
    </div>
  );
}

export default PaywallModal;
