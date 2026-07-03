export type TaskCategory = 'amt' | 'versicherung' | 'wohnen' | 'finanzen' | 'mobilitaet'

export interface Task {
  id: string
  title: string
  summary: string
  steps: string[]
  deadline: string
  consequence: string
  category: TaskCategory
}

export interface Journey {
  id: string
  title: string
  subtitle: string
  tasks: Task[]
}
