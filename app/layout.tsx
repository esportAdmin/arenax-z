import "./globals.css";
import type { Metadata } from "next";
import { Providers } from "./providers";
import { TierPromotionListener } from "@/components/system/TierPromotionListener";

export const metadata: Metadata = {
  title: {
    default: "RallyGuild by ArenaX",
    template: "%s | RallyGuild by ArenaX",
  },
  description:
    "A retention platform for Discord and Twitch-led gaming communities.",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico" },
    ],
    shortcut: "/favicon.ico",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>
          {children}
          <TierPromotionListener />
        </Providers>
      </body>
    </html>
  );
}
