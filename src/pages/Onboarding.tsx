import { useNavigate } from 'react-router-dom'
import { fragen, type Profile } from '../data/profile'
import { useProfile } from '../hooks/useProfile'
import FragenWizard, { type WizardFrage } from '../components/FragenWizard'

// Onboarding nutzt jetzt den generischen FragenWizard. Die profilspezifischen
// Fragen werden auf das generische Wizard-Format gemappt (feld → key).
const wizardFragen: WizardFrage[] = fragen.map(f => ({
  key: f.feld,
  titel: f.titel,
  hinweis: f.hinweis,
  optionen: f.optionen,
}))

export default function Onboarding() {
  const navigate = useNavigate()
  const { profile, save } = useProfile()

  const fertig = (antworten: Record<string, string>) => {
    void save(antworten as Profile).then(() => navigate('/'))
  }

  return (
    <FragenWizard
      fragen={wizardFragen}
      initial={(profile ?? {}) as Record<string, string>}
      onFertig={fertig}
      onAbbruch={() => navigate('/')}
    />
  )
}
