import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Lifeguage — Loan Eligibility Score for Trinidad & Tobago",
    template: "%s | Lifeguage",
  },
  description:
    "Find out how much you can borrow in 3 minutes. No credit check, no bank visit. Get your loan eligibility score from real TT lenders including First Citizens, Republic Bank, and JMMB.",
  keywords: [
    "loan Trinidad",
    " Trinidad and Tobago loan",
    "borrowing Trinidad",
    "credit score TT",
    "loan eligibility",
    "First Citizens loan",
    "Republic Bank loan",
    "JMMB loan",
    "credit union Trinidad",
    "personal loan TT",
    "business loan Trinidad",
    "loan calculator Trinidad",
    "no credit check loan",
    "fast loan approval Trinidad",
  ],
  authors: [{ name: "Lifeguage" }],
  creator: "Lifeguage",
  metadataBase: new URL("https://lifeguage.com"),
  openGraph: {
    type: "website",
    locale: "en_TT",
    url: "https://lifeguage.com",
    siteName: "Lifeguage",
    title: "Lifeguage — Loan Eligibility Score for Trinidad & Tobago",
    description:
      "Find out how much you can borrow in 3 minutes. No credit check, no bank visit. See your loan eligibility from real TT lenders.",
    images: [
      {
        url: "/og-image.png",
        width: "1200",
        height: "630",
        alt: "Lifeguage — Loan Eligibility for Trinidad & Tobago",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lifeguage — Loan Eligibility Score for Trinidad & Tobago",
    description:
      "Find out how much you can borrow in 3 minutes. No credit check, no bank visit.",
    creator: "@lifeguage",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://lifeguage.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
