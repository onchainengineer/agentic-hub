import type { Metadata } from "next";
import { Public_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const publicSans = Public_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-public-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Agentic Hub — Find Your Next Open Source Contribution",
  description:
    "Discover the best agentic AI open source projects to contribute to. AI-curated, beginner-scored, updated weekly. LangChain, CrewAI, MCP, coding agents, and more.",
  keywords: [
    "agentic ai",
    "open source",
    "good first issue",
    "langchain",
    "crewai",
    "mcp",
    "ai agents",
    "llm",
    "rag",
    "coding agents",
  ],
  openGraph: {
    title: "Agentic Hub",
    description:
      "Find your next agentic AI open source contribution. AI-curated, updated weekly.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${publicSans.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased bg-brand-neutral-100 text-gray-900">
        {children}
      </body>
    </html>
  );
}
