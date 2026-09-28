import type { Metadata } from "next";
import { Source_Serif_4 } from "next/font/google";
import "katex/dist/katex.min.css";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { Providers } from "@/components/Providers";

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: { default: "IntegralSense", template: "%s - IntegralSense" },
  description: "Practice problems and a technique wiki for integration bees.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sourceSerif.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-serif">
        <Providers>
          <Nav />
          <main className="mx-auto w-full max-w-2xl flex-1 px-5 pt-10 pb-24">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
