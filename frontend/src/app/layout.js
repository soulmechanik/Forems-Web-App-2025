import Providers from "@/components/Providers"; // adjust path as needed
import "./globals.css";

export const metadata = {
  title: "Forems Africa",
  description: "Property management software",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}