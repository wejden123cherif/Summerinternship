import { Poppins } from "next/font/google";
import "./globals.css";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import { ThemeProvider } from "next-themes";
import ScrollToTop from "../components/ScrollToTop";
import I18nProvider from "../components/I18nProvider";
const font = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700"], });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body className={`${font.className}`}>
        <ThemeProvider
          attribute="class"
          enableSystem={true}
          defaultTheme="light"
        >
          <I18nProvider>
            <Header />
            {children}
            <Footer />
            <ScrollToTop />
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}