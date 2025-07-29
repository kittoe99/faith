'use client'

import { useState, useEffect } from 'react'

interface NavigationProps {
  activeSection: string
}

export default function Navigation({ activeSection }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const menuItems = [
    { id: 'home', label: 'Dashboard', icon: 'fas fa-tachometer-alt' },
    { id: 'altar', label: 'Altar Practice', icon: 'fas fa-praying-hands' },
    { id: 'bible', label: 'Bible', icon: 'fas fa-book-bible' },
    { id: 'bible-study', label: 'Bible Study', icon: 'fas fa-graduation-cap' },
    { id: 'tasks', label: 'Tasks', icon: 'fas fa-tasks' },
    { id: 'journal', label: 'Journal', icon: 'fas fa-feather-alt' },
    { id: 'resources', label: 'Resources', icon: 'fas fa-toolbox' },
  ]

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMenuOpen(false)
      }
    }

    const handleClickOutside = (e: MouseEvent) => {
      if (window.innerWidth <= 768) {
        const target = e.target as Element
        const navMenu = document.getElementById('nav-menu')
        const menuToggle = document.getElementById('mobile-menu-toggle')
        
        if (navMenu && menuToggle && 
            !navMenu.contains(target) && 
            !menuToggle.contains(target)) {
          setIsMenuOpen(false)
        }
      }
    }

    window.addEventListener('resize', handleResize)
    document.addEventListener('click', handleClickOutside)

    return () => {
      window.removeEventListener('resize', handleResize)
      document.removeEventListener('click', handleClickOutside)
    }
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleNavClick = (sectionId: string) => {
    window.location.hash = sectionId
    setIsMenuOpen(false)
  }

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      {isMenuOpen && (
        <>
          <button
            className="mobile-menu-toggle active"
            onClick={toggleMenu}
            aria-label="Close navigation menu"
          >
            <i className="fas fa-times"></i>
          </button>
          {/* Screen dimmer */}
          <div
            onClick={toggleMenu}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[999] md:hidden"
            aria-hidden="true"
          />
        </>
      )}
      <button 
        id="mobile-menu-toggle"
        className={`mobile-menu-toggle ${isMenuOpen ? 'active' : ''}`}
        onClick={toggleMenu}
      >
        <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-plus'}`} id="menu-icon"></i>
      </button>

      {/* Navigation Menu */}
      <nav 
        id="nav-menu"
        className={`nav-menu ${isMenuOpen ? 'active' : ''}`}
      >
        <h2 className="text-2xl mb-6 px-4">My Walk</h2>
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={activeSection === item.id ? 'active' : ''}
                onClick={(e) => {
                  e.preventDefault()
                  handleNavClick(item.id)
                }}
              >
                <i className={`fa-fw ${item.icon}`}></i>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  )
}
