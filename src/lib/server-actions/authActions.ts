"use server";

import z from "zod";
import { FormSchema } from "../types";
import { cookies } from "next/headers";
import { createClient } from "../supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function actionLoginUser({ email, password }: z.infer<typeof FormSchema>) {
    const supabase = await createClient()
    const response = await supabase.auth.signInWithPassword({
        email,
        password,
    })

   return response
}


export async function actionSignUpUser({ email, password }: z.infer<typeof FormSchema>) {
    const supabase = await createClient()
    const response = await supabase.auth.signUp({
        email,
        password,
    })

    return response
}