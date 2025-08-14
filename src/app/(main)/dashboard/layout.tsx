import { getSupabaseUser } from '@/lib/provider/getSupabaseUser';
import { prisma } from '@/lib/supabase/db';
import React from 'react'

async function layout({children ,params}: {children: React.ReactNode, params: {slug: string}}) {

  const user = await getSupabaseUser()

  if (user?.id && user?.email) {
    await prisma.user.upsert({
      where: {
        email: user.email,
      },
      update: {
        userId: user.id,
        id: user.id,
      },
      create: {
        userId: user.id,
        email: user.email,
        id: user.id,
      },
    })
  }
  
  return (
    <main className='flex overflow-hidden h-screen'>
        {children}
    </main>
  )
}

export default layout