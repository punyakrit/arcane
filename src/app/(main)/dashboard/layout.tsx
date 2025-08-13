import React from 'react'

function layout({children ,params}: {children: React.ReactNode, params: {slug: string}}) {
  return (
    <main className='flex overflow-hidden h-screen'>
        {children}
    </main>
  )
}

export default layout