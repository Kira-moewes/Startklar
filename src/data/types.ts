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
}

export interface Journey {
  id: string
  title: string
  subtitle: string
  tasks: Task[]
}
