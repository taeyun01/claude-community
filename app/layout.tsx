import type { Metadata } from "next";
import { IBM_Plex_Sans, Poppins } from "next/font/google";
import BottomTabNav from "@/components/BottomTabNav";
import "./globals.css";

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "600"],
});

export const metadata: Metadata = {
  title: "커뮤니티",
  description: "모바일 웹 커뮤니티 서비스",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ko"
      className={`${ibmPlexSans.variable} ${poppins.variable} antialiased`}
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
