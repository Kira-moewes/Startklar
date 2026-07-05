import type { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useRealtimeSync } from '../hooks/useRealtimeSync'
import { useApplyTheme } from '../hooks/useProfile'

const navItems = [
  { to: '/ideen', label: 'Ideen' },
  { to: '/inbox', label: 'Inbox' },
  { to: '/graph', label: 'Graph' },
  { to: '/agent', label: 'Agent' },
  { to: '/settings', label: 'Einstellungen' },
]

export function Layout({ children }: { children: ReactNode }) {
  useRealtimeSync()
  useApplyTheme()

  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="flex w-56 shrink-0 flex-col overflow-y-auto border-r border-mist bg-paper-card px-4 py-6">
        <h1 className="font-display text-xl text-graphite">Ideen</h1>
        <nav aria-label="Hauptnavigation" className="mt-8 flex flex-col gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `rounded-field px-3 py-2 text-sm transition ${
                  isActive
                    ? 'bg-indigo text-white'
                    : 'text-graphite-soft hover:bg-mist'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <button
          type="button"
          onClick={() => supabase.auth.signOut()}
          className="mt-auto rounded-field px-3 py-2 text-left text-sm text-graphite-soft hover:bg-mist"
        >
          Abmelden
        </button>
      </aside>
      <main id="main-content" className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
