import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import { site } from "@/config/site";
import "@/styles/globals.css";
import "@/styles/motion.css";
import "@/styles/premium.css";
import "@/styles/entry-and-program.css";
import "@/styles/flow-layout.css";
import "@/styles/vivid-motion.css";
import "@/styles/media-and-feedback.css";

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
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '1615223779888343');
fbq('track', 'PageView');`}
        </Script>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1615223779888343&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
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
