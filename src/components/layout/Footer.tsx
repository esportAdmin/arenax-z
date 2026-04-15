import { forwardRef } from "react";
import { Github, Linkedin, MessageCircle, Twitter } from "lucide-react";
import { AppLink } from "@/components/AppLink";

const footerLinks = {
  product: [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Live Calls", href: "/live-calls" },
    { name: "Rewards", href: "/rewards" },
    { name: "Leaderboard", href: "/leaderboard" },
  ],
  company: [
    { name: "About", href: "/about" },
    { name: "Careers", href: "/careers" },
    { name: "Press Kit", href: "/press" },
    { name: "Contact", href: "/contact" },
  ],
  resources: [
    { name: "Concierge Guide", href: "/docs" },
    { name: "FAQ", href: "/faq" },
    { name: "Contact & Support", href: "/contact" },
  ],
  legal: [
    { name: "Terms of Service", href: "/terms" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Legal Notice", href: "/legal" },
  ],
};

const socialLinks = [
  { name: "Twitter", href: "https://twitter.com", icon: Twitter },
  { name: "Discord", href: "https://discord.com", icon: MessageCircle },
  { name: "GitHub", href: "https://github.com", icon: Github },
  { name: "LinkedIn", href: "https://linkedin.com", icon: Linkedin },
];

export const Footer = forwardRef<HTMLElement>(function Footer(_, ref) {
  return (
    <footer ref={ref} className="border-t border-border/50 bg-card/30">
      <div className="container-arena py-10 lg:py-16">
        <div className="mb-8 rounded-[1.75rem] border border-white/10 bg-white/[0.03] px-4 py-4 sm:px-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary/80">
                Launch-ready signal
              </div>
              <div className="mt-1 text-base font-semibold text-white">
                RallyGuild is built around return pressure, prestige, and visible progression.
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="metal-chip">Daily mission cadence</div>
              <div className="metal-chip">Live club rivalry</div>
              <div className="metal-chip">Premium reward loops</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 md:grid-cols-5 lg:gap-12">
          <div className="col-span-2 md:col-span-1">
            <AppLink href="/" className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary text-lg font-display font-bold text-primary-foreground">
                RG
              </div>
              <span className="flex flex-col leading-none">
                <span className="text-xl font-display font-bold text-foreground">
                  RallyGuild
                </span>
                <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-primary/80">
                  by ArenaX-Z
                </span>
              </span>
            </AppLink>

            <p className="mb-6 text-sm text-muted-foreground">
              Where serious esports communities build status, sharpen their reads,
              and turn match knowledge into momentum.
            </p>

            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-display font-bold uppercase tracking-wider">
              Product
            </h4>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <AppLink
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.name}
                  </AppLink>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-display font-bold uppercase tracking-wider">
              Company
            </h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <AppLink
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.name}
                  </AppLink>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-display font-bold uppercase tracking-wider">
              Resources
            </h4>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <AppLink
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.name}
                  </AppLink>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-display font-bold uppercase tracking-wider">
              Legal
            </h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <AppLink
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.name}
                  </AppLink>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-border/50 pt-8">
          <p className="mx-auto mb-6 max-w-3xl text-center text-xs text-muted-foreground/60">
            Arena Points are virtual gaming units with no monetary value.
            RallyGuild by ArenaX-Z is an entertainment and competitive engagement platform.
            No cash value or financial return is offered through platform play.
          </p>

          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-muted-foreground">
              Copyright 2026 RallyGuild by ArenaX-Z. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="h-2 w-2 animate-pulse rounded-full bg-success" />
              <span>Live Platform Status</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
});
