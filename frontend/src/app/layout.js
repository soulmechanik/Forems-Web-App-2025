import "./globals.css"
import Providers from "./Providers"

export const metadata = {
  title: "Forems Africa",
  description: "Property management software",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
