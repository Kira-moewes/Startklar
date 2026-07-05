import { Link } from 'react-router-dom'
import { AuthForm } from '../components/AuthForm'

export function Signup() {
  return (
    <div className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-6 px-4">
      <div>
        <h1 className="font-display text-3xl text-graphite">Konto erstellen</h1>
        <p className="mt-1 text-graphite-soft">Leg los mit deiner Ideen-Sammlung.</p>
      </div>
      <AuthForm mode="signup" />
      <p className="text-sm text-graphite-soft">
        Schon ein Konto?{' '}
        <Link to="/login" className="text-indigo hover:underline">
          Anmelden
        </Link>
      </p>
    </div>
  )
}
