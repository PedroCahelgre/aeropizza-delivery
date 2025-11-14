import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import SimpleInstallPopup from "@/components/SimpleInstallPopup";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AeroPizza - Sabor que voa até sua casa!",
  description: "As melhores pizzas delivery da região. Peça online e receba em 30-40 minutos. Qualidade que voa até você!",
  keywords: ["AeroPizza", "Pizza", "Delivery", "Comida", "Pizzaria", "Pedido Online"],
  authors: [{ name: "AeroPizza Team" }],
  icons: {
    icon: [
      { url: "/favicon-footer.svg", sizes: "any", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.png", sizes: "1024x1024", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" }
    ],
    apple: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" }
    ]
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "AeroPizza",
    startupImage: [
      {
        url: "/icon-192.png",
        media: "(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2)"
      }
    ]
  },
  openGraph: {
    title: "AeroPizza - Sabor que voa até sua casa!",
    description: "As melhores pizzas delivery da região. Peça online e receba em 30-40 minutos.",
    url: "https://aeropizza.example.com",
    siteName: "AeroPizza",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AeroPizza - Sabor que voa até sua casa!",
    description: "As melhores pizzas delivery da região. Peça online e receba em 30-40 minutos.",
  },
  other: {
    "msapplication-TileColor": "#000000",
    "msapplication-config": "/browserconfig.xml"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#eab308" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="AeroPizza" />
        <meta name="application-name" content="AeroPizza" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <link rel="icon" type="image/svg+xml" href="/favicon-footer.svg" />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
 
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
        suppressHydrationWarning
      >
        {children}
        <Toaster />
        <SimpleInstallPopup />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />

      </body>
    </html>
  );
}
