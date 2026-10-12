import "./globals.css";
import Providers from "../components/Providers";

export const metadata = {
  title: "School Fee Management (Demo)",
  description: "Fee collection, receipts and defaulter tracking for schools",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
