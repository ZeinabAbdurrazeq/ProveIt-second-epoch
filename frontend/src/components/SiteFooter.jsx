import { Link } from "react-router";
import { useUser } from "@clerk/react";
import {
  ArrowRightIcon,
  GlobeIcon,
  LinkIcon,
  MailIcon,
  SparklesIcon,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { getTranslator } from "../lib/translations";

function SiteFooter() {
  const { isSignedIn } = useUser();
  const { language } = useLanguage();
  const t = getTranslator(language);

  const publicLinks = [
    { label: t("marketing.home"), to: "/" },
    { label: t("marketing.pricing"), to: "/pricing" },
    { label: t("marketing.about"), to: "/about" },
    { label: t("marketing.contact"), to: "/contact" },
  ];

  const appLinks = [
    { label: t("marketing.home"), to: "/" },
    { label: t("nav.dashboard"), to: "/dashboard" },
    { label: t("nav.problems"), to: "/problems" },
    { label: t("nav.availability"), to: "/availability/settings" },
    { label: t("nav.schedule"), to: "/schedule" },
    { label: t("nav.invitations"), to: "/invitations" },
    { label: t("nav.aiInterview"), to: "/ai-interview" },
    { label: t("nav.subscription"), to: "/subscription" },
    { label: t("marketing.pricing"), to: "/pricing" },
  ];

  const sections = isSignedIn
    ? [
        {
          title: t("footer.workspace"),
          links: appLinks,
        },
        {
          title: t("footer.company"),
          links: [
            { label: t("marketing.about"), to: "/about" },
            { label: t("marketing.contact"), to: "/contact" },
          ],
        },
      ]
    : [
        {
          title: t("footer.explore"),
          links: publicLinks,
        },
        {
          title: t("footer.company"),
          links: [
            { label: t("marketing.about"), to: "/about" },
            { label: t("marketing.contact"), to: "/contact" },
          ],
        },
      ];

  return (
    <footer className="border-t border-base-300/80 bg-base-200">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-r from-primary via-secondary to-accent shadow-lg">
                <SparklesIcon className="size-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-black tracking-wider bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text font-mono text-transparent">
                  Provelt
                </p>
                <p className="text-sm text-base-content/60">
                  {t("footer.tagline")}
                </p>
              </div>
            </div>

            <p className="max-w-md text-base-content/70 leading-relaxed">
              {t("footer.description")}
            </p>

            <div className="flex flex-wrap gap-3">
              <a
                href="mailto:hello@provelt.app"
                className="btn btn-sm btn-primary gap-2 rounded-full"
              >
                <MailIcon className="size-4" />
                hello@provelt.app
              </a>
              <Link to="/pricing" className="btn btn-sm btn-outline gap-2 rounded-full">
                {t("marketing.pricing")}
                <ArrowRightIcon className="size-4" />
              </Link>
            </div>
          </div>

          {sections.map((section) => (
            <div key={section.title} className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-[0.25em] text-base-content/50">
                {section.title}
              </h3>
              <div className="flex flex-col gap-3">
                {section.links.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="w-fit text-base-content/75 transition-colors duration-200 hover:text-primary"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-6 border-t border-base-300/70 pt-6 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-base-content/60">
            {t("footer.rights").replace("{year}", String(new Date().getFullYear()))}
          </p>

          <div className="flex items-center gap-2">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="flex size-10 items-center justify-center rounded-full border border-base-300 bg-base-100 text-base-content/70 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary hover:text-primary hover:shadow-md"
            >
              <GlobeIcon className="size-4" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="flex size-10 items-center justify-center rounded-full border border-base-300 bg-base-100 text-base-content/70 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary hover:text-primary hover:shadow-md"
            >
              <LinkIcon className="size-4" />
            </a>
            <a
              href="mailto:hello@provelt.app"
              aria-label="Email"
              className="flex size-10 items-center justify-center rounded-full border border-base-300 bg-base-100 text-base-content/70 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary hover:text-primary hover:shadow-md"
            >
              <MailIcon className="size-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default SiteFooter;
