'use client'

import { useState } from 'react'
import Link from 'next/link'
import { BookOpen, Home, LayoutDashboard, Library } from 'lucide-react'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const links = [
    { href: '/', label: 'Home', icon: <Home className="w-4 h-4" /> },
    { href: '/lessons/honor', label: 'Honor', icon: <span className="text-lg">🐉</span> },
    { href: '/lessons/noble', label: 'Noble', icon: <span className="text-lg">✨</span> },
    { href: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { href: '/resources', label: 'Resources', icon: <Library className="w-4 h-4" /> },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-white">TeachYoung</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {links.map(({ href, label, icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all text-sm font-medium"
              >
                {icon}
                {label}
              </Link>
            ))}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-slate-400 hover:text-white"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? (
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l8 8M6 14l8-8" /></svg>
            ) : (
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h12M4 10h12M4 14h12" /></svg>
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden border-t border-slate-800/50 py-3 flex flex-col gap-1">
            {links.map(({ href, label, icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all text-sm font-medium"
                onClick={() => setOpen(false)}
              >
                {icon}
                {label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}
