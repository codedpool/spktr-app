import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata = {
  title: "spktr — Proactive Context. Local-First Intelligence.",
  description:
    "spktr is your local-first proactive context engine. A digital twin that reads every pixel, remembers your workflow, and stays one step ahead.",
  metadataBase: new URL("https://spktr.local"),
  openGraph: {
    title: "spktr",
    description: "Proactive Context. Local-First Intelligence.",
    type: "website",
  },
};

export const viewport = {
  themeColor: "#050505",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} bg-[#050505]`}
    >
      <body className="bg-[#050505] font-sans text-white antialiased">
        {children}
      </body>
    </html>
  );
}
