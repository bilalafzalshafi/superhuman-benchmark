import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Superhuman Benchmark",
  description: "Test your cognitive abilities with challenging brain games",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <header className="bg-white border-b border-gray-200">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
              <Link href="/" className="flex items-center space-x-2">
                <span className="text-blue-500 text-2xl">⚡</span>
                <span className="text-lg font-bold uppercase tracking-wide text-gray-800">Superhuman Benchmark</span>
              </Link>
              <nav>
                <ul className="flex space-x-6">
                  <li>
                    <Link href="/dashboard" className="text-gray-800 hover:text-blue-600 uppercase tracking-wide text-sm font-semibold">
                      Dashboard
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          </header>
          <main className="flex-grow">{children}</main>
          <footer className="bg-gray-100 py-3 border-t border-gray-200">
            <div className="container mx-auto px-4 text-center text-xs text-gray-500">
              Superhuman Benchmark - A hardcore version of Human Benchmark
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}