import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Sidebar } from '@/components/layout/Sidebar';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'NóminaClara AI Copilot',
  description: 'Plataforma de soporte de nómina con inteligencia artificial — Colombia y México',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        <div className="flex h-screen overflow-hidden bg-[#08080d] text-slate-100">
          <Sidebar />
          <main className="flex flex-1 overflow-hidden">{children}</main>
        </div>
      </body>
    </html>
  );
}
