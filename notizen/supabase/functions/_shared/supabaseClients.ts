import { createClient } from 'jsr:@supabase/supabase-js@2'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

/** Client scoped to the calling user's JWT — used only to verify identity. */
export function createUserClient(authHeader: string) {
  return createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authHeader } },
  })
}

/** Privileged client bypassing RLS — every query must filter by user_id explicitly. */
export function createAdminClient() {
  return createClient(supabaseUrl, serviceRoleKey)
}

export async function getAuthenticatedUser(req: Request) {
  const authHeader = req.headers.get('Authorization')
  if (!authHeader) return null
  const userClient = createUserClient(authHeader)
  const {
    data: { user },
  } = await userClient.auth.getUser()
  return user
}
