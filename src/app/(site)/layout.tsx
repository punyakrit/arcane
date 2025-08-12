import Header from '@/components/landingPage/Header'
import React from 'react'

function HomepageLayout({children}: {children: React.ReactNode}) {
  return (
    <div>
      <Header/>
      {children}
    </div>
  )
}

export default HomepageLayout
