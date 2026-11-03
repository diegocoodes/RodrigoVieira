import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { site } from "@/config/site";
import "@/styles/globals.css";
import "@/styles/motion.css";
import "@/styles/premium.css";
import "@/styles/entry-and-program.css";
import "@/styles/flow-layout.css";
import "@/styles/vivid-motion.css";

const manrope = localFont({
  src: "../../public/fonts/manrope-variable-latin.woff2",
  variable: "--font-body",
  display: "swap",
  weight: "400 800",
});
const barlow = localFont({
  src: "../../public/fonts/barlow-condensed-600-latin.woff2",
  variable: "--font-heading",
  display: "swap",
  weight: "600",
});

export const metadata: Metadata = {
  ...(site.url
    ? { metadataBase: new URL(site.url), alternates: { canonical: "/" } }
    : {}),
  title: site.title,
  description: site.description,
  applicationName: site.name,
  openGraph: {
    title: site.title,
    description: site.description,
    locale: "pt_BR",
    type: "website",
    siteName: site.name,
    ...(site.url
      ? {
          url: site.url,
          images: [
            {
              url: "/images/rodrigo-social.jpg",
              width: 1200,
              height: 630,
              alt: "Rodrigo Vieira, Mentoria Do Zero a 50 Administrações",
            },
          ],
        }
      : {
          images: [
            {
              url: "https://gestconadmimoveis-cyber.github.io/mentoria-rodrigo-vieira/rodrigo-azul-sorrindo.jpeg",
              alt: "Rodrigo Vieira",
            },
          ],
        }),
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
    images: [
      site.url
        ? `${site.url}/images/rodrigo-social.jpg`
        : "https://gestconadmimoveis-cyber.github.io/mentoria-rodrigo-vieira/rodrigo-azul-sorrindo.jpeg",
    ],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#080808",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${manrope.variable} ${barlow.variable}`}>
      <body>
        <noscript>
          <style>{`*,*::before,*::after{animation:none!important;transition-duration:.01ms!important}`}</style>
        </noscript>
        <a className="skip-link" href="#conteudo">
          Pular para o conteúdo
        </a>
        {children}
      </body>
    </html>
  );
}
