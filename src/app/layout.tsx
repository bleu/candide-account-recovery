import type { Metadata } from "next";
import { Roboto, Roboto_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Header from "@/components/header";
import { Web3Provider } from "@/providers/Web3Provider";
import { Toaster } from "@/components/ui/toaster";
import { LoadingContextProvider } from "@/providers/loading";

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
  title: "Safe Cover | Safe Account Recovery",
  description: "Ensure you never lose access to your Safe Account. Designate trusted contacts or use your own hardware wallets as recovery methods.",
  icons: ["https://github.com/candidelabs.png"],
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
        <Web3Provider>
          <LoadingContextProvider>
            <Header />
            {children}
            <Toaster />
          </LoadingContextProvider>
        </Web3Provider>
      </body>
    </html>
  );
}
