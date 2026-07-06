import { useState, type FormEvent } from 'react'
import { supabase } from '../lib/supabaseClient'

interface AuthFormProps {
  mode: 'login' | 'signup'
}

export function AuthForm({ mode }: AuthFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [signupDone, setSignupDone] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    const { error: authError } =
      mode === 'login'
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password })

    setSubmitting(false)

    if (authError) {
      setError(authError.message)
      return
    }

    if (mode === 'signup') {
      setSignupDone(true)
    }
  }

  if (signupDone) {
    return (
      <p className="text-graphite-soft">
        Konto erstellt. Bitte bestätige deine E-Mail-Adresse und melde dich anschließend an.
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1 text-sm text-graphite-soft">
        E-Mail
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-field border border-mist bg-paper-card px-3 py-2 text-graphite outline-none focus:border-indigo"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm text-graphite-soft">
        Passwort
        <input
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-field border border-mist bg-paper-card px-3 py-2 text-graphite outline-none focus:border-indigo"
        />
      </label>
      {error && <p className="text-sm text-amber">{error}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="rounded-pill bg-indigo px-4 py-2 font-medium text-white transition hover:bg-indigo-deep disabled:opacity-60"
      >
        {mode === 'login' ? 'Anmelden' : 'Konto erstellen'}
      </button>
    </form>
  )
}
