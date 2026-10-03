import { ersteWohnungJourney } from './journeys/erste-wohnung.js'
import { mobilitaetJourney } from './journeys/mobilitaet.js'
import { finanzenJourney } from './journeys/finanzen.js'
import { startJourney } from './journeys/start.js'

export const journeys = [startJourney, ersteWohnungJourney, finanzenJourney, mobilitaetJourney]

export { startJourney, ersteWohnungJourney, mobilitaetJourney, finanzenJourney }
