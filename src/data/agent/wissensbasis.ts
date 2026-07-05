import { journeys } from '../index'
import { vergleichsKategorien } from '../vergleich'
import { faktum } from '../fakten'
import { normalisiere } from '../../lib/retrieval'
import { faqEintraege } from './faq'
import type { WissensEintrag } from './types'

// Baut Klaros Wissensbasis einmalig aus den echten App-Inhalten –
// keine Duplikation: Quelle sind journeys, Vergleichskategorien und die FAQ.

let cache: WissensEintrag[] | null = null

export function wissensbasis(): WissensEintrag[] {
  if (cache) return cache
  const eintraege: WissensEintrag[] = []

  for (const journey of journeys) {
    for (const task of journey.tasks) {
      const text = [task.summary, ...task.steps, `Frist: ${task.deadline}`, task.consequence].join(' ')
      const ungeprueft = (task.faktenKeys ?? []).some(k => faktum(k)?.geprueft === null)
      const titel = task.title
      eintraege.push({
        id: `task:${journey.id}:${task.id}`,
        art: 'task',
        titel,
        kurz: task.summary,
        text: `${journey.title} ${text}`,
        route: `/journey/${journey.id}/task/${task.id}`,
        kategorie: task.category,
        journeyId: journey.id,
        taskId: task.id,
        ungeprueft,
        normTitel: normalisiere(titel),
        normText: normalisiere(`${journey.title} ${text}`),
      })
    }
  }

  for (const kat of vergleichsKategorien) {
    const text = [kat.intro, ...kat.tipps].join(' ')
    eintraege.push({
      id: `vergleich:${kat.id}`,
      art: 'vergleich',
      titel: `${kat.titel} vergleichen`,
      kurz: kat.intro,
      text,
      route: `/vergleich/${kat.id}`,
      normTitel: normalisiere(`${kat.titel} vergleichen anbieter vergleich`),
      normText: normalisiere(text),
    })
  }

  for (const faq of faqEintraege) {
    eintraege.push({
      id: `faq:${faq.id}`,
      art: 'faq',
      titel: faq.titel,
      kurz: faq.text,
      text: faq.text,
      route: faq.route,
      normTitel: normalisiere(faq.titel),
      normText: normalisiere(faq.text),
    })
  }

  cache = eintraege
  return eintraege
}
