'use client'

import { useState, useEffect } from 'react'

export default function BibleStudy() {
  const [studySessions, setStudySessions] = useState<any[]>([])

  useEffect(() => {
    // Load study sessions from localStorage
    const savedSessions = localStorage.getItem('studySessions')
    if (savedSessions) {
      setStudySessions(JSON.parse(savedSessions))
    }
  }, [])

  return (
    <section className="content-section active">
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <i className="fas fa-book-bible text-gray-300 text-6xl mb-4"></i>
          <h3 className="text-2xl font-semibold text-gray-700 mb-2">Bible Study Section</h3>
          <p className="text-gray-500 mb-6">
            Track your Bible study sessions, take notes, and reflect on God's Word.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            <div className="dashboard-card text-center">
              <i className="fas fa-book-open text-blue-500 text-3xl mb-3"></i>
              <h4 className="text-lg font-semibold mb-2">Daily Reading</h4>
              <p className="text-gray-600 text-sm">Track your daily Bible reading progress</p>
              <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                Start Reading
              </button>
            </div>
            
            <div className="dashboard-card text-center">
              <i className="fas fa-sticky-note text-green-500 text-3xl mb-3"></i>
              <h4 className="text-lg font-semibold mb-2">Study Notes</h4>
              <p className="text-gray-600 text-sm">Take detailed notes on scriptures and insights</p>
              <button className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                Add Notes
              </button>
            </div>
            
            <div className="dashboard-card text-center">
              <i className="fas fa-lightbulb text-yellow-500 text-3xl mb-3"></i>
              <h4 className="text-lg font-semibold mb-2">Revelations</h4>
              <p className="text-gray-600 text-sm">Record spiritual insights and revelations</p>
              <button className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors">
                Add Insight
              </button>
            </div>
          </div>
          
          <div className="mt-8 p-6 bg-blue-50 rounded-lg">
            <h4 className="text-lg font-semibold text-blue-800 mb-2">Coming Soon</h4>
            <p className="text-blue-600">
              Full Bible study features including verse lookup, commentary integration, 
              and study plan tracking will be available in the next update.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
