'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { BookOpen, LayoutDashboard, Search, User, Settings, LogOut, Award, MessageSquare } from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { href: '/catalog', label: 'Catalogue', icon: Search },
  { href: '/profile', label: 'Mon profil', icon: User },
  { href: '/admin', label: 'Administration', icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    const sb = createClient()
    await sb.auth.signOut()
    router.push('/auth/login')
    router.refresh()
  }

  return (
    <aside className="w-60 flex flex-col h-screen sticky top-0"
      style={{ background: 'var(--paper)', borderRight: '1px solid var(--line)' }}>
      {/* Logo */}
      <div className="p-5 flex items-center gap-3" style={{ borderBottom: '1px solid var(--line)' }}>
        <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold"
          style={{ background: 'var(--red)' }}>F</div>
        <div>
          <div className="font-bold text-sm" style={{ color: 'var(--ink)' }}>ETAGIA</div>
          <div className="text-xs" style={{ color: 'var(--ink-mut)' }}>LMS Platform</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href}
            className={`sidebar-link ${pathname === href || pathname.startsWith(href + '/') ? 'active' : ''}`}>
            <Icon size={18} />
            <span>{label}</span>
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3" style={{ borderTop: '1px solid var(--line)' }}>
        <button onClick={handleLogout} className="sidebar-link w-full">
          <LogOut size={18} />
          <span>Déconnexion</span>
        </button>
      </div>
    </aside>
  )
}
