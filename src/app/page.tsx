'use client'

import { useState, useEffect } from 'react'
import Navigation from '@/components/Navigation'
import Dashboard from '@/components/Dashboard'
import MobileBottomNav from '@/components/MobileBottomNav'
import AltarPractice from '@/components/AltarPractice'
import Bible from '@/components/Bible'
import BibleStudy from '@/components/BibleStudy'
import Tasks from '@/components/Tasks'
import Journal from '@/components/Journal'
import Resources from '@/components/Resources'
import { AuthGuard } from '@/components/AuthGuard'

export default function Home() {
  const [activeSection, setActiveSection] = useState('home')
  const [pageTitle, setPageTitle] = useState('Dashboard')

  useEffect(() => {
    // Handle hash changes for navigation
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') || 'home'
      setActiveSection(hash)
      updatePageTitle(hash)
    }

    // Set initial section from URL hash
    handleHashChange()
    
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const updatePageTitle = (section: string) => {
    const titles: { [key: string]: string } = {
      home: 'Dashboard',
      altar: 'Altar Practice',
      bible: 'Holy Bible',
      'bible-study': 'Bible Study',
    tasks: 'Tasks',
      journal: 'Journal',
      resources: 'Resources'
    }
    setPageTitle(titles[section] || 'Dashboard')
  }

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'altar':
        return <AltarPractice />
      case 'bible':
        return <Bible />
      case 'bible-study':
        return <BibleStudy />
      case 'tasks':
        return <Tasks />
      case 'journal':
        return <Journal />
      case 'resources':
        return <Resources />
      default:
        return <Dashboard />
    }
  }

  return (
    <AuthGuard requireAuth={true}>
      <div className="max-w-screen-xl mx-auto main-grid">
        {/* Desktop sidebar */}
        <div className="hidden md:block">
          <Navigation activeSection={activeSection} />
        </div>
        {/* Mobile bottom nav */}
        <MobileBottomNav activeSection={activeSection} />
        
        <main className="pb-32 md:pb-0">
          <header className="mb-8">
            <h1 id="page-title" className="text-3xl font-bold mb-2">{pageTitle}</h1>
            <p className="text-lg text-gray-600">A record of faith, growth, and grace.</p>
          </header>

          <div id="content-container">
            {renderActiveSection()}
          </div>
        </main>
      </div>
    </AuthGuard>
  )
}
