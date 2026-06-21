import { Link, useLocation } from "react-router";
import {
  BookOpenIcon,
  CalendarClockIcon,
  CalendarPlusIcon,
  CreditCardIcon,
  LayoutDashboardIcon,
  LanguagesIcon,
  MailIcon,
  MicIcon,
  SparklesIcon,
} from "lucide-react";
import { UserButton } from "@clerk/react";
import NotificationBell from "./NotificationBell";
import { useLanguage } from "../context/LanguageContext";
import { getTranslator } from "../lib/translations";

function Navbar() {
  const location = useLocation();
  const { language, toggle } = useLanguage();
  const t = getTranslator(language);

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { to: "/problems", label: t("nav.problems"), icon: BookOpenIcon },
    { to: "/availability/settings", label: t("nav.availability"), icon: CalendarClockIcon },
    { to: "/ai-interview", label: t("nav.aiInterview"), icon: MicIcon },
    { to: "/dashboard", label: t("nav.dashboard"), icon: LayoutDashboardIcon },
    { to: "/schedule", label: t("nav.schedule"), icon: CalendarPlusIcon },
    { to: "/invitations", label: t("nav.invitations"), icon: MailIcon },
    { to: "/subscription", label: t("nav.subscription"), icon: CreditCardIcon },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-base-300/60 bg-base-100/90 shadow-[0_8px_30px_rgb(0,0,0,0.08)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
        {/* LOGO */}
        <Link
          to="/"
          className="group flex shrink-0 items-center gap-3 transition-transform duration-200 hover:scale-[1.03]"
        >
          <div className="flex size-11 items-center justify-center rounded-2xl bg-gradient-to-r from-primary via-secondary to-accent shadow-lg">
            <SparklesIcon className="size-6 text-white" />
          </div>

          <div className="flex flex-col leading-none">
            <span className="font-black text-xl tracking-wider bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text font-mono text-transparent">
              Provelt
            </span>
            <span className="mt-1 text-xs font-medium text-base-content/60">
              {t("nav.tagline")}
            </span>
          </div>
        </Link>

        {/* CENTER NAV */}
        <div className="hidden flex-1 justify-center xl:flex">
          <div className="flex max-w-full items-center gap-1 overflow-x-auto rounded-2xl border border-base-300/70 bg-base-200/30 p-1 shadow-sm">
            {navItems.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200 ${
                  isActive(to)
                    ? "bg-primary text-primary-content shadow-sm"
                    : "text-base-content/70 hover:bg-base-200 hover:text-base-content"
                }`}
              >
                <Icon className="size-4 shrink-0" />
                <span>{label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* RIGHT UTILS */}
        <div className="ms-auto flex shrink-0 items-center gap-2">
          <button
            onClick={toggle}
            className="btn btn-ghost btn-sm gap-2 rounded-xl px-3 text-base-content/70 hover:text-base-content"
            title={t("nav.toggleLanguage")}
          >
            <LanguagesIcon className="size-4" />
            <span className="text-sm font-semibold">
              {language === "en" ? "AR" : "EN"}
            </span>
          </button>

          <NotificationBell />

          <div className="flex items-center rounded-full border border-base-300 bg-base-100 p-1 shadow-sm">
            <UserButton />
          </div>
        </div>
      </div>
    </nav>
  );
}
export default Navbar;
