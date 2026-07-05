export interface Folder {
  id: string
  user_id: string
  parent_id: string | null
  name: string
  path: string
  color: string | null
  created_at: string
  updated_at: string
}

export type IdeaKind = 'idea' | 'note'

export interface Idea {
  id: string
  user_id: string
  folder_id: string | null
  kind: IdeaKind
  title: string
  content: Record<string, unknown>
  content_text: string | null
  auto_filed: boolean
  filing_confidence: number | null
  needs_review: boolean
  created_at: string
  updated_at: string
}

export type LinkRelation = 'related' | 'builds_on' | 'contradicts' | 'example_of' | 'question_for'

export interface IdeaLink {
  id: string
  user_id: string
  source_id: string
  target_id: string
  relation: LinkRelation
  score: number
  origin: 'ai' | 'user'
  created_at: string
}
