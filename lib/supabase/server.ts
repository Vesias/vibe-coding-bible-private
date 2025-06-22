import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from '@/lib/database.types'

export const createServerSupabaseClient = () => {
  const cookieStore = cookies()
  return createServerComponentClient<Database>({ cookies: () => cookieStore })
}

export const getUser = async () => {
  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export const getUserProfile = async () => {
  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null
  
  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()
  
  return profile
}