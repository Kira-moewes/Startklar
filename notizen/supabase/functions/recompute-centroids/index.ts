// Nächtlicher Cron-Job (siehe supabase/functions/recompute-centroids/cron.md):
// rekomputiert die Ordner-Zentroid-Embeddings aus den enthaltenen Ideen.
import { corsHeaders, handleOptions } from '../_shared/cors.ts'
import { createAdminClient } from '../_shared/supabaseClients.ts'

Deno.serve(async (req) => {
  const preflight = handleOptions(req)
  if (preflight) return preflight

  const admin = createAdminClient()
  const { error } = await admin.rpc('recompute_folder_centroids')

  if (error) {
    console.error(error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  return new Response(JSON.stringify({ ok: true }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
})
