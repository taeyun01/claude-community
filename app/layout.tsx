import type { Metadata } from "next";
import { IBM_Plex_Sans, Poppins } from "next/font/google";
import BottomTabNav from "@/components/BottomTabNav";
import { getTheme } from "@/lib/getTheme";
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

const SITE_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

const SITE_TITLE = "도란도란 커뮤니티";
const SITE_DESCRIPTION =
  "소소한 일상 이야기부터 유용한 정보와 재미있는 투표까지!";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  icons: {
    icon: "/favicon.png",
  },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/og-image.png",
        width: 1730,
        height: 909,
      },
    ],
  },
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const theme = await getTheme();

  return (
    <html
      lang="ko"
      data-theme={theme}
      className={`${ibmPlexSans.variable} ${poppins.variable} antialiased`}
    >
      <body className="flex min-h-screen justify-center bg-gray-100">
        <div className="bg-surface relative flex min-h-screen w-full max-w-md flex-col">
          <div className="flex-1 pb-[82px]">{children}</div>
          <BottomTabNav />
        </div>
      </body>
    </html>
  );
}
