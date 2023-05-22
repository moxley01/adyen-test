/* eslint-disable @next/next/no-sync-scripts */
import "./globals.css";
import { Inter } from "next/font/google";
import "@adyen/adyen-web/dist/adyen.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Adyen Checkout Demo",
  description:
    "Demo of Adyen Checkout integration with Next.js and server components",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://checkoutshopper-live.adyen.com/checkoutshopper/sdk/5.42.0/adyen.css"
          integrity="sha384-BRZCzbS8n6hZVj8BESE6thGk0zSkUZfUWxL/vhocKu12k3NZ7xpNsIK39O2aWuni"
          crossOrigin="anonymous"
        />
      </head>
      <body className={inter.className}>
        <script
          src="https://checkoutshopper-live.adyen.com/checkoutshopper/sdk/5.42.0/adyen.js"
          integrity="sha384-PMAmeZG/M005l456dtr3YFnLXyBwhDuZ3m6xTQ11Emy7YnD0ZpiIObEwb8EnARU8"
          crossOrigin="anonymous"
        ></script>
        {children}
      </body>
    </html>
  );
}
