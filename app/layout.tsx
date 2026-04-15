import "./globals.css";
import { Providers } from "./providers";
import { TierPromotionListener } from "@/components/system/TierPromotionListener";

export const metadata = {
  title: "RallyGuild by ArenaX-Z",
  description:
    "A retention platform for Discord and Twitch-led gaming communities.",
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
