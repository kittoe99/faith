'use client'

import { useState, useEffect } from 'react'

interface NavigationProps {
  activeSection: string
}

export default function Navigation({ activeSection }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showAiModal, setShowAiModal] = useState(false)

  const menuItems = [
    { id: 'ai', label: 'Ai', icon: 'fas fa-robot' },
    { id: 'home', label: 'Dashboard', icon: 'fas fa-tachometer-alt' },
    { id: 'altar', label: 'Altar Practice', icon: 'fas fa-praying-hands' },
    { id: 'bible', label: 'Bible', icon: 'fas fa-book-bible' },
    { id: 'bible-study', label: 'Bible Study', icon: 'fas fa-graduation-cap' },
    { id: 'tasks', label: 'Tasks', icon: 'fas fa-tasks' },
    { id: 'journal', label: 'Journal', icon: 'fas fa-feather-alt' },
    { id: 'income-tithes', label: 'Income & Tithes', icon: 'fas fa-hand-holding-usd' },
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
    if (showAiModal) setShowAiModal(false)
    setIsMenuOpen(!isMenuOpen)
  }

  const toggleAiModal = () => setShowAiModal(!showAiModal);

  const handleNavClick = (sectionId: string) => {
    window.location.hash = sectionId
    setIsMenuOpen(false)
  }

  return (
    <>
      {/* Mobile Ai Chat Toggle Button */}
      <button
        id="ai-chat-toggle"
        style={{ top: '50%' }}
        className="fixed left-2 w-6 h-6 translate-y-1/2 z-[1000] p-0 text-purple-600 bg-transparent opacity-80 hover:opacity-100 transition md:hidden"
        onClick={toggleAiModal}
      >
        <i className="fas fa-robot text-[20px]"></i>
      </button>

      {/* Mobile Menu Toggle Button */}
      <button 
        id="mobile-menu-toggle"
        style={{ top: '50%' }}
        className="fixed left-2 w-6 h-6 translate-y-1/2 z-[1000] p-0 text-blue-600 bg-transparent opacity-80 hover:opacity-100 transition md:hidden"
        onClick={toggleMenu}
      >
        <i className="fas fa-plus text-[20px]" id="menu-icon"></i>
      </button>

      {/* Navigation Menu - Desktop sidebar, Mobile modal */}
      <nav className={`nav-menu z-[1002] ${isMenuOpen ? 'active' : ''}`}>
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

      {/* Ai Chat Modal - Mobile */}
      {showAiModal && (
        <div className="fixed inset-0 z-[1001] flex items-center justify-center md:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={toggleAiModal} />
          <div className="relative bg-white rounded-2xl shadow-xl w-11/12 max-w-sm h-[70vh] flex flex-col p-4 z-[1002]">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">Ai Chat</h3>
              <button onClick={toggleAiModal} className="text-gray-500 hover:text-gray-700">
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto mb-3" id="ai-chat-messages">
              {/* TODO: render messages here */}
            </div>
            <div className="flex gap-2">
              <input type="text" placeholder="Type a message..." className="flex-1 border rounded px-2 py-1 text-sm" />
              <button className="px-3 py-1 bg-purple-600 text-white rounded text-sm">
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile overlay backdrop */}
      {isMenuOpen && (
        <div
          onClick={toggleMenu}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[999] md:hidden"
          aria-hidden="true"
        />
      )}
    </>
  )
}
