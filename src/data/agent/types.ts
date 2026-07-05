import type { TaskCategory } from '../types'

export type AgentRolle = 'nutzer' | 'klaro'

export type AgentLink = { label: string; route: string }

export type AgentAction =
  | { typ: 'navigiere'; route: string; label: string }
  | { typ: 'termin-vorschlag'; titel: string; journeyId?: string; taskId?: string }
  | { typ: 'erledigt-vorschlag'; journeyId: string; taskId: string; titel: string }

export type AgentMessage = {
  id: string
  rolle: AgentRolle
  text: string
  links?: AgentLink[]
  actions?: AgentAction[]
  quelle?: 'lokal' | 'ki'
  zeit: string
}

export type WissensEintrag = {
  id: string
  art: 'task' | 'vergleich' | 'faq'
  titel: string
  kurz: string
  text: string
  route: string
  kategorie?: TaskCategory
  journeyId?: string
  taskId?: string
  /** true, wenn der Eintrag Beträge/Fristen enthält, die noch redaktionell geprüft werden */
  ungeprueft?: boolean
  /** vorberechnete, normalisierte Suchfelder */
  normTitel: string
  normText: string
}
