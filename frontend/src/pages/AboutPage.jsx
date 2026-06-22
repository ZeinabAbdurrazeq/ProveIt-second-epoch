import {
  SparklesIcon,
  TargetIcon,
  EyeIcon,
  HeartIcon,
  UsersIcon,
  ScaleIcon,
} from "lucide-react";
import MarketingNav from "../components/MarketingNav";
import { useLanguage } from "../context/LanguageContext";
import { getTranslator } from "../lib/translations";

// Public "About Us" marketing page. Content is static and easy to edit later
// through the translation keys in lib/translations.js.
function AboutPage() {
  const { language } = useLanguage();
  const t = getTranslator(language);

  const values = [
    {
      icon: HeartIcon,
      title: t("about.value1Title"),
      body: t("about.value1Body"),
    },
    {
      icon: UsersIcon,
      title: t("about.value2Title"),
      body: t("about.value2Body"),
    },
    {
      icon: ScaleIcon,
      title: t("about.value3Title"),
      body: t("about.value3Body"),
    },
  ];

  return (
    <div className="min-h-screen bg-base-300">
      <MarketingNav />

      {/* HERO */}
      <div className="mx-auto max-w-7xl px-6 py-20 text-center">
        <div className="size-16 mx-auto rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center shadow-lg mb-6">
          <SparklesIcon className="size-8 text-white" />
        </div>
        <h1 className="text-4xl lg:text-5xl font-black mb-4">
          {t("about.title")}
        </h1>
        <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
          {t("about.subtitle")}
        </p>
      </div>

      {/* MISSION / VISION */}
      <div className="mx-auto max-w-7xl px-6 pb-12">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="card bg-base-100 border border-base-300 shadow-lg">
            <div className="card-body rtl:text-right">
              <div className="flex items-center gap-3 mb-2 rtl:flex-row-reverse">
                <div className="p-2 bg-primary/10 rounded-xl">
                  <TargetIcon className="size-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold">{t("about.missionTitle")}</h2>
              </div>
              <p className="text-base-content/70 leading-relaxed">
                {t("about.missionBody")}
              </p>
            </div>
          </div>

          <div className="card bg-base-100 border border-base-300 shadow-lg">
            <div className="card-body rtl:text-right">
              <div className="flex items-center gap-3 mb-2 rtl:flex-row-reverse">
                <div className="p-2 bg-secondary/10 rounded-xl">
                  <EyeIcon className="size-6 text-secondary" />
                </div>
                <h2 className="text-2xl font-bold">{t("about.visionTitle")}</h2>
              </div>
              <p className="text-base-content/70 leading-relaxed">
                {t("about.visionBody")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* VALUES */}
      <div className="mx-auto max-w-7xl px-6 py-12">
        <h2 className="text-3xl font-bold text-center mb-10">
          {t("about.valuesTitle")}
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {values.map((value, idx) => {
            const Icon = value.icon;
            return (
              <div key={idx} className="card bg-base-100 shadow-xl">
                <div className="card-body items-center text-center">
                  <div className="size-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                    <Icon className="size-8 text-primary" />
                  </div>
                  <h3 className="card-title">{value.title}</h3>
                  <p className="text-base-content/70">{value.body}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default AboutPage;
