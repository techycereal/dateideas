import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Dates Designed",
  description: "Find date ideas",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <meta name="google-adsense-account" content="ca-pub-1228146293754772"></meta>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
