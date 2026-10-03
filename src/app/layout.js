// src/app/layout.js
import './globals.css';

export const metadata = {
  title: 'CheckYourWeb — 7-Perspective Website Health & Growth Audit',
  description: 'Inspect simulated perspectives across Google, visitors, AI crawlers, SEO, answer engines, and business customers in one continuous scroll.',
  icons: {
    icon: '/icon.png?v=3',
    shortcut: '/icon.png?v=3',
    apple: '/icon.png?v=3',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased flex flex-col" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}