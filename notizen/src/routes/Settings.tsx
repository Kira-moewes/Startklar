import { useAuth } from '../lib/AuthProvider'
import { useProfile, useUpdateProfile } from '../hooks/useProfile'

export function Settings() {
  const { session } = useAuth()
  const { data: profile } = useProfile()
  const updateProfile = useUpdateProfile()

  return (
    <div className="mx-auto max-w-xl p-8">
      <h2 className="font-display text-2xl text-graphite">Einstellungen</h2>

      <section className="mt-6 rounded-card border border-mist bg-paper-card p-5">
        <h3 className="font-medium text-graphite">Konto</h3>
        <p className="mt-1 text-sm text-graphite-soft">{session?.user.email}</p>
      </section>

      <section className="mt-4 flex items-center justify-between rounded-card border border-mist bg-paper-card p-5">
        <div>
          <h3 className="font-medium text-graphite">Darstellung</h3>
          <p className="mt-1 text-sm text-graphite-soft">Helles oder dunkles Design.</p>
        </div>
        <button
          type="button"
          onClick={() => updateProfile.mutate({ theme: profile?.theme === 'dark' ? 'light' : 'dark' })}
          className="rounded-pill border border-mist px-4 py-1.5 text-sm text-graphite hover:bg-mist"
        >
          {profile?.theme === 'dark' ? 'Zu Hell wechseln' : 'Zu Dunkel wechseln'}
        </button>
      </section>

      <section className="mt-4 flex items-center justify-between rounded-card border border-mist bg-paper-card p-5">
        <div>
          <h3 className="font-medium text-graphite">Automatische Einsortierung</h3>
          <p className="mt-1 text-sm text-graphite-soft">
            Neue Ideen automatisch per KI einsortieren und verknüpfen lassen.
          </p>
        </div>
        <label className="inline-flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={profile?.auto_filing_enabled ?? true}
            onChange={(e) => updateProfile.mutate({ auto_filing_enabled: e.target.checked })}
            className="h-4 w-4 accent-indigo"
          />
          <span className="text-sm text-graphite-soft">Aktiv</span>
        </label>
      </section>
    </div>
  )
}
