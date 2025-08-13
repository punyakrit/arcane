"use server"

import { prisma } from "./db"
import { createClient } from "./server"

export async function getUserSubscription(userId: string) {
    try {
        const supabase = await createClient()
        const response = await prisma.subscriptions.findFirst({
            where:{
                user_id: userId
            },
            select:{id: true,status: true}
        })
        return {
            subscription: response,
            error: null
        }
    } catch (e) {
        return {
            subscription: null,
            error: e
        }
    }
}