import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import AppThemeProvider from '@/providers/ThemeProvider';
import ReduxProvider from '@/components/ReduxProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Dynamic Data Table Manager',
  description: 'A dynamic data table with Redux, Material UI, and CSV import/export',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReduxProvider>
          <AppThemeProvider>
            {children}
          </AppThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}