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
          <header className="bg-blue-600 text-white">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
              <Link href="/" className="text-xl font-bold">
                Superhuman Benchmark
              </Link>
              <nav>
                <ul className="flex space-x-4">
                  <li>
                    <Link href="/dashboard" className="hover:underline">
                      Dashboard
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          </header>
          <main className="flex-grow">{children}</main>
          <footer className="bg-gray-100 py-4">
            <div className="container mx-auto px-4 text-center text-sm text-gray-600">
              Superhuman Benchmark - A hardcore version of Human Benchmark
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}