'use client'

import { useState } from 'react'

export default function BibleStudy() {
  const [activeStudyTool, setActiveStudyTool] = useState('reading-plan')

  const studyTools = [
    {
      id: 'reading-plan',
      title: 'Reading Plans',
      icon: 'fas fa-calendar-alt',
      color: 'blue',
      description: 'Structured plans to read through the Bible systematically'
    },
    {
      id: 'study-notes',
      title: 'Study Notes',
      icon: 'fas fa-sticky-note',
      color: 'green',
      description: 'Take detailed notes on scriptures and insights'
    },
    {
      id: 'revelations',
      title: 'Revelations',
      icon: 'fas fa-lightbulb',
      color: 'yellow',
      description: 'Record spiritual insights and revelations'
    },
    {
      id: 'bookmarks',
      title: 'Bookmarks',
      icon: 'fas fa-bookmark',
      color: 'purple',
      description: 'Save and organize your favorite verses'
    },
    {
      id: 'concordance',
      title: 'Concordance',
      icon: 'fas fa-search',
      color: 'indigo',
      description: 'Search for words and themes across Scripture'
    },
    {
      id: 'commentary',
      title: 'Commentary',
      icon: 'fas fa-comments',
      color: 'red',
      description: 'Access biblical commentary and explanations'
    }
  ]

  const renderStudyTool = () => {
    switch (activeStudyTool) {
      case 'reading-plan':
        return (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Bible Reading Plans</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-blue-600 mb-2">One Year Bible</h4>
                <p className="text-gray-600 text-sm mb-3">Read through the entire Bible in one year with daily readings from Old Testament, New Testament, Psalms, and Proverbs.</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">365 days</span>
                  <button className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600">Start</button>
                </div>
              </div>
              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-green-600 mb-2">New Testament</h4>
                <p className="text-gray-600 text-sm mb-3">Focus on the New Testament with a 90-day reading plan covering the life and teachings of Jesus.</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">90 days</span>
                  <button className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600">Start</button>
                </div>
              </div>
              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-purple-600 mb-2">Psalms & Proverbs</h4>
                <p className="text-gray-600 text-sm mb-3">Daily wisdom from Psalms and Proverbs, perfect for morning or evening devotions.</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">31 days</span>
                  <button className="px-3 py-1 bg-purple-500 text-white text-sm rounded hover:bg-purple-600">Start</button>
                </div>
              </div>
              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-orange-600 mb-2">Gospels</h4>
                <p className="text-gray-600 text-sm mb-3">Journey through the four Gospels to understand the life and ministry of Jesus Christ.</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">60 days</span>
                  <button className="px-3 py-1 bg-orange-500 text-white text-sm rounded hover:bg-orange-600">Start</button>
                </div>
              </div>
            </div>
          </div>
        )
      case 'study-notes':
        return (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Study Notes</h3>
              <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                <i className="fas fa-plus mr-2"></i>New Note
              </button>
            </div>
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-800">John 3:16 - God's Love</h4>
                  <span className="text-xs text-gray-500">2 days ago</span>
                </div>
                <p className="text-gray-600 text-sm mb-3">This verse encapsulates the entire gospel message. God's love is so great that He gave His only Son...</p>
                <div className="flex gap-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">Salvation</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Love</span>
                </div>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-800">Psalm 23 - The Good Shepherd</h4>
                  <span className="text-xs text-gray-500">1 week ago</span>
                </div>
                <p className="text-gray-600 text-sm mb-3">David's beautiful metaphor of God as our shepherd provides comfort and assurance...</p>
                <div className="flex gap-2">
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">Comfort</span>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">Trust</span>
                </div>
              </div>
            </div>
          </div>
        )
      default:
        return (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <i className="fas fa-graduation-cap text-4xl text-gray-300 mb-4"></i>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Select a Study Tool</h3>
            <p className="text-gray-500">Choose a tool from the sidebar to enhance your Bible study experience.</p>
          </div>
        )
    }
  }

  return (
    <section className="content-section active">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-400 to-blue-500 rounded-full mb-4 shadow-lg">
            <i className="fas fa-graduation-cap text-white text-2xl"></i>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Bible Study</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Deepen your understanding of God's Word with powerful study tools and resources.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Study Tools */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Study Tools</h3>
              <div className="space-y-2">
                {studyTools.map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => setActiveStudyTool(tool.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      activeStudyTool === tool.id
                        ? `bg-${tool.color}-500 text-white shadow-md`
                        : `hover:bg-${tool.color}-50 text-gray-700`
                    }`}
                  >
                    <div className="flex items-center">
                      <i className={`${tool.icon} mr-3 w-5`}></i>
                      <div>
                        <div className="font-medium">{tool.title}</div>
                        <div className={`text-xs ${
                          activeStudyTool === tool.id ? 'text-white opacity-90' : 'text-gray-500'
                        }`}>
                          {tool.description}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              
              {/* Quick Access to Bible */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <a 
                  href="#bible" 
                  className="flex items-center justify-center w-full p-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
                >
                  <i className="fas fa-book-bible mr-2"></i>
                  Read Bible
                </a>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {renderStudyTool()}
          </div>
        </div>
      </div>
    </section>
  )
}
