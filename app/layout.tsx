import "./globals.css";
import { Providers } from "./providers";
import { TierPromotionListener } from "@/components/system/TierPromotionListener";

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
