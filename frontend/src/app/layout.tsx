import type { Metadata } from 'next';
import './globals.css';
import { Geist } from 'next/font/google';
import { cn } from '@/lib/utils';
import { I18nProvider } from '@/features/i18n/i18n.context';

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'दुहाई | Milking Tracker with Music',
  description: 'Mobile-first milking session tracker with calming music for dairy cattle.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hi" className={cn('font-sans antialiased', geist.variable)}>
      <body className="min-h-screen bg-[#FAF7F2] text-[#18221D] antialiased">
        <I18nProvider>
          <div className="w-full max-w-md sm:max-w-lg min-h-screen mx-auto flex flex-col relative">
            <main className="flex-1 flex flex-col">
              {children}
            </main>
          </div>
        </I18nProvider>
      </body>
    </html>
  );
}
