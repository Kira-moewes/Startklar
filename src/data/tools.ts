export type ToolCategory = 'steuern' | 'geld' | 'versicherung' | 'mobilitaet' | 'beruf'

export interface ToolMeta {
  id: string
  title: string
  teaser: string
  category: ToolCategory
  component: string
}

export const tools: ToolMeta[] = [
  {
    id: 'stuercheck',
    title: 'SteuerCheck',
    teaser: 'Lohnt sich eine Steuererklärung für mich?',
    category: 'steuern',
    component: 'SteuerCheck',
  },
  {
    id: 'staatsgeldcheck',
    title: 'StaatsGeldCheck',
    teaser: 'BAföG, Wohngeld & Co. — wofür komme ich in Frage?',
    category: 'geld',
    component: 'StaatsGeldCheck',
  },
  {
    id: 'versichertcheck',
    title: 'VersichertCheck',
    teaser: 'Bin ich noch familienversichert?',
    category: 'versicherung',
    component: 'VersichertCheck',
  },
  {
    id: 'autokostenrechner',
    title: 'AutoKostenRechner',
    teaser: 'Was kostet mich mein Auto wirklich monatlich?',
    category: 'mobilitaet',
    component: 'AutoKostenRechner',
  },
  {
    id: 'budgetrechner',
    title: 'BudgetRechner',
    teaser: 'Die 50/30/20-Faustregel für dein Budget',
    category: 'geld',
    component: 'BudgetRechner',
  },
  {
    id: 'berufstest',
    title: 'BerufsTest',
    teaser: 'Welcher Beruf passt zu mir? Check-U ausprobieren.',
    category: 'beruf',
    component: 'BerufsTest',
  },
]
