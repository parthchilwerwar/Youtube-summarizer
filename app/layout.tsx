import './globals.css'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { Providers } from './providers'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['300', '400', '500', '600', '700', '800']
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  weight: ['400', '500', '600', '700']
})

export const metadata = {
  title: 'VideoInsight - YouTube Transcriber',
  description: 'Convert YouTube videos into readable transcripts with clickable timestamps.',
  keywords: 'YouTube, transcription, video, transcript, orange theme',
  authors: [{ name: 'Parth Chilwerwar' }],
  creator: 'Parth Chilwerwar',
  openGraph: {
    title: 'VideoInsight - YouTube Transcriber',
    description: 'Convert YouTube videos into readable transcripts with clickable timestamps',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#FF6B00" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${inter.variable} ${jetbrainsMono.variable} ${inter.className} antialiased`}>
        <Providers>
          <div className="min-h-screen bg-[#0d1117]">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  )
}