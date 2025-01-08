import type { Metadata } from "next";
import { Roboto, Roboto_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-roboto",
});

const robotoMono = Roboto_Mono({
  weight: ["300", "400", "700"],
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Candide Account Recovery",
  description: "Recover your Safe Accounts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          roboto.className,
          robotoMono.className,
          "flex flex-col min-h-screen font-roboto"
        )}
      >
        <header className="flex h-32 items-center justify-around">
          <h1 className="text-primary font-bold text-lg font-roboto-mono">
            Safe Account Recovery
          </h1>
          <input className="bg-content-background" />
          <button className="bg-primary text-primary-foreground py-2 px-4 rounded-lg font-roboto-mono">
            Connect wallet
          </button>
        </header>
        {children}
      </body>
    </html>
  );
}
