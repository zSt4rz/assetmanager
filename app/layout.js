// /app/layout.js
import './globals.css'
import Providers from './providers'
import NavBar from './ui/navbar'

export const metadata = {
  title: 'MetaVault',
  description: 'Auth demo',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="overflow-x-hidden">
        <NavBar></NavBar>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
