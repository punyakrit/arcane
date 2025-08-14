"use server"
import { createClient } from "../supabase/server"

export async function getSupabaseUser() {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.getUser()
    if (error) {
        console.log(error)
    }
    return data.user
}