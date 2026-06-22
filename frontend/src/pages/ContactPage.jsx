import { useState } from "react";
import toast from "react-hot-toast";
import { MailIcon, SendIcon, MessageSquareIcon } from "lucide-react";
import MarketingNav from "../components/MarketingNav";
import { useLanguage } from "../context/LanguageContext";
import { getTranslator } from "../lib/translations";

// Static contact address used for the mailto fallback. Update later if needed.
const CONTACT_EMAIL = "hello@provelt.app";

// Public "Contact Us" page. There is no contact backend yet, so the form
// composes a mailto: link to the support inbox as a graceful fallback.
function ContactPage() {
  const { language } = useLanguage();
  const t = getTranslator(language);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error(t("contact.validation"));
      return;
    }

    const subject = encodeURIComponent(`Provelt contact from ${name}`);
    const body = encodeURIComponent(`${message}\n\nFrom: ${name} <${email}>`);
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="min-h-screen bg-base-300">
      <MarketingNav />

      <div className="mx-auto max-w-7xl px-6 py-16">
        {/* HEADER */}
        <div className="text-center mb-12">
          <div className="size-16 mx-auto rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center shadow-lg mb-6">
            <MessageSquareIcon className="size-8 text-white" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-black mb-4">
            {t("contact.title")}
          </h1>
          <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
            {t("contact.subtitle")}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* CONTACT INFO */}
          <div className="md:col-span-1 space-y-4">
            <div className="card bg-base-100 border border-base-300 shadow-lg">
              <div className="card-body rtl:text-right">
                <div className="flex items-center gap-3 rtl:flex-row-reverse">
                  <div className="p-2 bg-primary/10 rounded-xl">
                    <MailIcon className="size-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs uppercase opacity-60">
                      {t("contact.emailUs")}
                    </p>
                    <a
                      href={`mailto:${CONTACT_EMAIL}`}
                      className="font-semibold hover:text-primary transition-colors"
                    >
                      {CONTACT_EMAIL}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FORM */}
          <div className="md:col-span-2">
            <form
              onSubmit={handleSubmit}
              className="card bg-base-100 border border-base-300 shadow-lg"
            >
              <div className="card-body space-y-4 rtl:text-right">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label">
                      <span className="label-text font-semibold">
                        {t("contact.nameLabel")}
                      </span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered w-full"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="label">
                      <span className="label-text font-semibold">
                        {t("contact.emailLabel")}
                      </span>
                    </label>
                    <input
                      type="email"
                      className="input input-bordered w-full"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="label">
                    <span className="label-text font-semibold">
                      {t("contact.messageLabel")}
                    </span>
                  </label>
                  <textarea
                    className="textarea textarea-bordered w-full"
                    rows={5}
                    placeholder={t("contact.messagePlaceholder")}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary gap-2 rtl:flex-row-reverse"
                >
                  <SendIcon className="size-4" />
                  {t("contact.send")}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;
