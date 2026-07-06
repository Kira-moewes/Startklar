import localforage from 'localforage'

// Alle localforage-Instanzen zentral, damit Hooks, Agent und
// Datenexport/-import garantiert dieselben Stores verwenden.
export const profilStore = localforage.createInstance({ name: 'startklar', storeName: 'profil' })
export const progressStore = localforage.createInstance({ name: 'startklar', storeName: 'progress' })
export const progressDatesStore = localforage.createInstance({ name: 'startklar', storeName: 'progress-dates' })
export const termineStore = localforage.createInstance({ name: 'startklar', storeName: 'termine' })
export const vergleichStore = localforage.createInstance({ name: 'startklar', storeName: 'vergleich' })
export const bedarfStore = localforage.createInstance({ name: 'startklar', storeName: 'bedarf' })
export const einstellungenStore = localforage.createInstance({ name: 'startklar', storeName: 'einstellungen' })
export const agentChatStore = localforage.createInstance({ name: 'startklar', storeName: 'agent-chat' })

// Für Export/Import/Löschen: Name im Export-JSON → Instanz
export const alleStores: Record<string, LocalForage> = {
  'profil': profilStore,
  'progress': progressStore,
  'progress-dates': progressDatesStore,
  'termine': termineStore,
  'vergleich': vergleichStore,
  'bedarf': bedarfStore,
  'einstellungen': einstellungenStore,
  'agent-chat': agentChatStore,
}
