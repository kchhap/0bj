import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ClerkProvider } from "@clerk/nextjs"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "0bj – AI 3D Model Generator",
  description: "0bj is an AI-powered web app that generates 3D models from text prompts instantly. Create, view, and export 3D objects in OBJ format for games, design, and 3D printing.",
  keywords: [
    "AI 3D model generator", "3D modeling", "OBJ", "text to 3D", "mesh", "Ankit Kachhap", "WebGL", "3D printing", "creative tools"
  ],
  robots: "index,follow",
  authors: [{ name: "Ankit Kachhap" }],
  creator: "Ankit Kachhap",
  applicationName: "0bj",
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#faedd8",
  colorScheme: "light",
  category: "technology",
  referrer: "origin-when-cross-origin",
  icons: [
    { rel: "icon", url: "/favicon.ico" }
  ]
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          {children}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  )
}
