// /app/layout.js
import './globals.css'
import Providers from './providers'
import NavBar from './ui/navbar'

export const metadata = {
  title: 'My App',
  description: 'Auth demo',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <NavBar></NavBar>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
