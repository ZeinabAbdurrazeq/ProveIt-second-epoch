import { Link } from "react-router";
import {
  ArrowRightIcon,
  CheckIcon,
  Code2Icon,
  SparklesIcon,
  UsersIcon,
  VideoIcon,
  ZapIcon,
} from "lucide-react";
import { SignInButton, useUser } from "@clerk/react";
import MarketingNav from "../components/MarketingNav";
import { useLanguage } from "../context/LanguageContext";
import { getTranslator } from "../lib/translations";

function HomePage() {
  const { isSignedIn } = useUser();
  const { language } = useLanguage();
  const t = getTranslator(language);

  return (
    <div className="min-h-screen bg-base-300">
      <MarketingNav />

      {/* HERO SECTION */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* LEFT CONTENT */}
          <div className="space-y-8 rtl:text-right">
            <div className="badge badge-primary badge-lg">
              <ZapIcon className="size-4" />
              {t("home.badge")}
            </div>

            <h1 className="text-5xl lg:text-7xl font-black leading-tight">
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                {t("home.heroTitle1")}
              </span>
              <br />
              <span className="text-base-content">{t("home.heroTitle2")}</span>
            </h1>

            <p className="text-xl text-base-content/70 leading-relaxed max-w-xl">
              {t("home.heroSubtitle")}
            </p>

            {/* FEATURE PILLS */}
            <div className="flex flex-wrap gap-3 rtl:flex-row-reverse">
              <div className="badge badge-lg badge-outline">
                <CheckIcon className="size-4 text-success" />
                {t("home.pillVideo")}
              </div>
              <div className="badge badge-lg badge-outline">
                <CheckIcon className="size-4 text-success" />
                {t("home.pillEditor")}
              </div>
              <div className="badge badge-lg badge-outline">
                <CheckIcon className="size-4 text-success" />
                {t("home.pillMultiLang")}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 rtl:flex-row-reverse">
              {isSignedIn ? (
                <Link to="/dashboard" className="btn btn-primary btn-lg rtl:flex-row-reverse">
                  {t("home.ctaDashboard")}
                  <ArrowRightIcon className="size-5 rtl:rotate-180" />
                </Link>
              ) : (
                <SignInButton mode="modal">
                  <button className="btn btn-primary btn-lg rtl:flex-row-reverse">
                    {t("home.ctaStart")}
                    <ArrowRightIcon className="size-5 rtl:rotate-180" />
                  </button>
                </SignInButton>
              )}

              <Link to="/pricing" className="btn btn-outline btn-lg rtl:flex-row-reverse">
                <VideoIcon className="size-5" />
                {t("home.ctaDemo")}
              </Link>
            </div>

            {/* STATS */}
            <div className="stats stats-vertical lg:stats-horizontal bg-base-100 shadow-lg">
              <div className="stat">
                <div className="stat-value text-primary">10K+</div>
                <div className="stat-title">{t("home.statUsers")}</div>
              </div>
              <div className="stat">
                <div className="stat-value text-secondary">50K+</div>
                <div className="stat-title">{t("home.statSessions")}</div>
              </div>
              <div className="stat">
                <div className="stat-value text-accent">99.9%</div>
                <div className="stat-title">{t("home.statUptime")}</div>
              </div>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <img
            src="/hero.png"
            alt="Provelt Platform"
            className="w-full h-auto rounded-3xl shadow-2xl border-4 border-base-100 hover:scale-105 transition-transform duration-500"
          />
        </div>
      </div>

      {/* FEATURES SECTION */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">{t("home.featuresTitle")}</h2>
          <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
            {t("home.featuresSubtitle")}
          </p>
        </div>

        {/* FEATURES GRID */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body items-center text-center">
              <div className="size-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                <VideoIcon className="size-8 text-primary" />
              </div>
              <h3 className="card-title">{t("home.feature1Title")}</h3>
              <p className="text-base-content/70">{t("home.feature1Body")}</p>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body items-center text-center">
              <div className="size-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                <Code2Icon className="size-8 text-primary" />
              </div>
              <h3 className="card-title">{t("home.feature2Title")}</h3>
              <p className="text-base-content/70">{t("home.feature2Body")}</p>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body items-center text-center">
              <div className="size-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                <UsersIcon className="size-8 text-primary" />
              </div>
              <h3 className="card-title">{t("home.feature3Title")}</h3>
              <p className="text-base-content/70">{t("home.feature3Body")}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default HomePage;
