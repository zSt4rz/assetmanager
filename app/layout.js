// /app/layout.js
import './globals.css'
import Providers from './providers'

export const metadata = {
  title: 'My App',
  description: 'Auth demo',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers> {/* MUST be inside body */}
      </body>
    </html>
  )
}
