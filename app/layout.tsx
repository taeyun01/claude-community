import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import BottomTabNav from "@/components/BottomTabNav";
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
  title: "커뮤니티",
  description: "모바일 웹 커뮤니티 서비스",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="min-h-screen bg-gray-100 flex justify-center">
        <div className="relative flex min-h-screen w-full max-w-md flex-col bg-white">
          <div className="flex-1 pb-[82px]">{children}</div>
          <BottomTabNav />
        </div>
      </body>
    </html>
  );
}
