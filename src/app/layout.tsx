import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
<<<<<<< HEAD
=======
import SimpleInstallPopup from "@/components/SimpleInstallPopup";
>>>>>>> ada758044931ecc5e181e0bf6f77781c2d51acb5

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
<<<<<<< HEAD
  title: "Z.ai Code Scaffold - AI-Powered Development",
  description: "Modern Next.js scaffold optimized for AI-powered development with Z.ai. Built with TypeScript, Tailwind CSS, and shadcn/ui.",
  keywords: ["Z.ai", "Next.js", "TypeScript", "Tailwind CSS", "shadcn/ui", "AI development", "React"],
  authors: [{ name: "Z.ai Team" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "Z.ai Code Scaffold",
    description: "AI-powered development with modern React stack",
    url: "https://chat.z.ai",
    siteName: "Z.ai",
=======
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
>>>>>>> ada758044931ecc5e181e0bf6f77781c2d51acb5
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
<<<<<<< HEAD
    title: "Z.ai Code Scaffold",
    description: "AI-powered development with modern React stack",
  },
=======
    title: "AeroPizza - Sabor que voa até sua casa!",
    description: "As melhores pizzas delivery da região. Peça online e receba em 30-40 minutos.",
  },
  other: {
    "msapplication-TileColor": "#000000",
    "msapplication-config": "/browserconfig.xml"
  }
>>>>>>> ada758044931ecc5e181e0bf6f77781c2d51acb5
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
<<<<<<< HEAD
    <html lang="en" suppressHydrationWarning>
=======
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
>>>>>>> ada758044931ecc5e181e0bf6f77781c2d51acb5
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
        suppressHydrationWarning
      >
<<<<<<< HEAD
        <div suppressHydrationWarning>
          {children}
          <Toaster />
        </div>
=======
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
>>>>>>> ada758044931ecc5e181e0bf6f77781c2d51acb5
      </body>
    </html>
  );
}
