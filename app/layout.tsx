import type { Metadata } from 'next'
import { Open_Sans } from 'next/font/google'
import "@/app/globals.css"

const font = Open_Sans({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Definitely Not Discord',
  description: 'Fullstack discord clone made with Next JS 14, styled with Shadcn UI and TailwindCSS.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={font.className}>{children}</body>
    </html>
  )
}
