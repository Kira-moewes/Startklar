export type TaskCategory = 'amt' | 'versicherung' | 'wohnen' | 'finanzen' | 'mobilitaet' | 'gesundheit' | 'recht' | 'arbeit'

export interface Task {
  id: string
  title: string
  summary: string
  steps: string[]
  deadline: string
  consequence: string
  category: TaskCategory
  faktenKeys?: string[]
  // Zeigt ab diesem Schritt (1-basiert) den Vergleichs-Chip direkt in der
  // Anleitung – für Schritte wie „Vergleiche zwei bis drei Tarife …".
  vergleichAbSchritt?: number
}

export interface Journey {
  id: string
  title: string
  subtitle: string
  tasks: Task[]
}
