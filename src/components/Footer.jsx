// src/components/Footer.jsx
'use client';

export default function Footer({ onOpenDrawer }) {
  return (
    <footer className="w-full border-t border-slate-200 bg-white py-8 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-900 text-sm">CheckYourWeb</span>
          <span>© 2026 CheckYourWeb. All rights reserved.</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 font-medium">
          <button
            type="button"
            onClick={() => onOpenDrawer?.('privacy')}
            className="hover:text-blue-600 transition-colors cursor-pointer"
          >
            Privacy Policy
          </button>
          <button
            type="button"
            onClick={() => onOpenDrawer?.('terms')}
            className="hover:text-blue-600 transition-colors cursor-pointer"
          >
            Terms of Service
          </button>
          <button
            type="button"
            onClick={() => onOpenDrawer?.('about')}
            className="hover:text-blue-600 transition-colors cursor-pointer"
          >
            About Us
          </button>
          <button
            type="button"
            onClick={() => onOpenDrawer?.('contact')}
            className="hover:text-blue-600 transition-colors cursor-pointer"
          >
            Contact
          </button>
        </div>

      </div>
    </footer>
  );
}