import { createClient } from '@supabase/supabase-js'

// Supabase-Projekt-Zugangsdaten. Der publishable/anon-Key ist bewusst öffentlich
// (er landet ohnehin im Browser-Bundle) — die Daten sind durch Row Level Security
// geschützt. Fest eingebaut, damit die App ohne Env-Konfiguration deploybar ist;
// per Vercel-Environment-Variablen aber überschreibbar.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? 'https://ctgurnhdtgkvgggcygtf.supabase.co'
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ?? 'sb_publishable_qz1d7WielBcsivO1BDDTAw_bXIhmN0V'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
