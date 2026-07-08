import type { Metadata } from "next";
import { Instrument_Sans, Onest } from "next/font/google";
import { ThemeProvider } from "@/providers/theme";
import { PayPalProvider } from "@/providers/paypal";
import { AuthProvider } from "@/contexts/auth-context";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import "./globals.css";

const instrumentSans = Onest({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Machu Picchu Bus Tickets 2026 | Book Online Fast & Secure",
  description: "Book your Machu Picchu bus tickets online quickly and safely. Official schedules, best prices, and instant confirmation. Travel from Cusco to Machu Picchu with ease.",
  /*keywords: [
    "machu picchu bus tickets",
    "book bus to machu picchu",
    "machu picchu bus 2026",
    "cusco to machu picchu bus",
    "machu picchu tickets online",
    "machu picchu shuttle bus",
    "peru bus tickets"
  ],
  openGraph: {
    title: "Machu Picchu Bus Tickets 2026 | Book Online Fast & Secure",
    description: "Book your Machu Picchu bus tickets online quickly and safely. Instant confirmation and best prices.",
    images: [
      {
        url: "", // Replace with your actual image
        width: 1200,
        height: 630,
        alt: "Machu Picchu Bus Tickets",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Machu Picchu Bus Tickets 2026 | Book Online",
    description: "Fast and secure online booking for Machu Picchu bus tickets.",
  },
  robots: {
    index: true,
    follow: true,
  },*/
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <body className={cn("antialiased", instrumentSans.className)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <PayPalProvider clientId={process.env.PAYPAL_CLIENT_ID!}>
            <AuthProvider>
              {children}
              <Toaster position="top-center" richColors />
            </AuthProvider>
          </PayPalProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
