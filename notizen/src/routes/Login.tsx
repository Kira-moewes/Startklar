import { Link } from 'react-router-dom'
import { AuthForm } from '../components/AuthForm'

export function Login() {
  return (
    <div className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-6 px-4">
      <div>
        <h1 className="font-display text-3xl text-graphite">Willkommen zurück</h1>
        <p className="mt-1 text-graphite-soft">Melde dich an, um deine Ideen zu sehen.</p>
      </div>
      <AuthForm mode="login" />
      <p className="text-sm text-graphite-soft">
        Noch kein Konto?{' '}
        <Link to="/signup" className="text-indigo hover:underline">
          Registrieren
        </Link>
      </p>
    </div>
  )
}
