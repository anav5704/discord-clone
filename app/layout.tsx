import { ClerkProvider } from '@clerk/nextjs'
import { ThemeProvider } from '@/providers/ThemeProvider'
import { Open_Sans } from 'next/font/google'
import type { Metadata } from 'next'
import { cn } from '@/lib/utils'
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
        <ClerkProvider>
            <html lang="en" suppressContentEditableWarning>
                <body className={cn(font.className, "bg-white dark:bg-[#313338]")}>
                    <ThemeProvider 
                        attribute='class' 
                        defaultTheme='dark' 
                        enableSystem 
                        storageKey='discord-theme'
                     >
                        {children}
                    </ThemeProvider>
                </body>
            </html>
        </ClerkProvider>
    )
}
