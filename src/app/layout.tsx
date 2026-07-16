import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/providers/CartProvider";
import { FavoritesProvider } from "@/components/providers/FavoritesProvider";
import { CompareProvider } from "@/components/providers/CompareProvider";
import { SettingsProvider, SiteSettings } from "@/components/providers/SettingsProvider";
import { createClient } from "@/utils/supabase/server";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://coffeebroadway-467110713551.europe-west1.run.app'),
  title: "Coffee Broadway | Крафтова кава та інвентар",
  description: "Крафтова кава та професійний інвентар для кав'ярень.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data: settingsData } = await supabase.from('site_settings').select('*');
  const initialSettings: SiteSettings = {};
  if (settingsData) {
    settingsData.forEach((setting) => {
      initialSettings[setting.key] = setting.value;
    });
  }

  return (
    <html lang="uk" className="dark">
      <body className={`${inter.className} bg-zinc-950 text-zinc-50 antialiased min-h-screen flex flex-col selection:bg-brand-500/30 selection:text-brand-500`}>
        <SettingsProvider initialSettings={initialSettings}>
          <FavoritesProvider>
            <CompareProvider>
              <CartProvider>
                {children}
              </CartProvider>
            </CompareProvider>
          </FavoritesProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
