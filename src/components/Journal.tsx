'use client'

import { useState, useEffect } from 'react'

interface JournalEntry {
  id: string
  title: string
  content: string
  date: string
  mood: string
  tags: string[]
}

export default function Journal() {
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [showEditor, setShowEditor] = useState(false)
  const [currentEntry, setCurrentEntry] = useState({
    title: '',
    content: '',
    mood: 'peaceful',
    tags: [] as string[]
  })

  useEffect(() => {
    // Load journal entries from localStorage
    const savedEntries = localStorage.getItem('journalEntries')
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries))
    }
  }, [])

  const saveEntries = (updatedEntries: JournalEntry[]) => {
    setEntries(updatedEntries)
    localStorage.setItem('journalEntries', JSON.stringify(updatedEntries))
  }

  const saveEntry = () => {
    if (!currentEntry.title.trim() || !currentEntry.content.trim()) return

    const entry: JournalEntry = {
      id: Date.now().toString(),
      title: currentEntry.title,
      content: currentEntry.content,
      date: new Date().toISOString(),
      mood: currentEntry.mood,
      tags: currentEntry.tags
    }

    saveEntries([entry, ...entries])
    setCurrentEntry({ title: '', content: '', mood: 'peaceful', tags: [] })
    setShowEditor(false)
  }

  const deleteEntry = (entryId: string) => {
    const updatedEntries = entries.filter(entry => entry.id !== entryId)
    saveEntries(updatedEntries)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getMoodIcon = (mood: string) => {
    const moods: { [key: string]: { icon: string; color: string } } = {
      joyful: { icon: 'fas fa-laugh-beam', color: 'text-yellow-500' },
      peaceful: { icon: 'fas fa-dove', color: 'text-blue-500' },
      grateful: { icon: 'fas fa-heart', color: 'text-pink-500' },
      contemplative: { icon: 'fas fa-thinking', color: 'text-purple-500' },
      hopeful: { icon: 'fas fa-rainbow', color: 'text-green-500' },
      struggling: { icon: 'fas fa-cloud-rain', color: 'text-gray-500' }
    }
    return moods[mood] || { icon: 'fas fa-smile', color: 'text-blue-500' }
  }

  return (
    <section className="content-section active">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Spiritual Journal</h2>
            <p className="text-gray-600">Record your thoughts, prayers, and spiritual reflections</p>
          </div>
          <button
            onClick={() => setShowEditor(!showEditor)}
            className="btn-primary px-6 py-3 rounded-lg font-medium"
          >
            <i className="fas fa-feather-alt mr-2"></i>
            New Entry
          </button>
        </div>

        {/* Journal Editor */}
        {showEditor && (
          <div className="dashboard-card mb-6">
            <h3 className="text-lg font-semibold mb-4">New Journal Entry</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={currentEntry.title}
                  onChange={(e) => setCurrentEntry(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="What's on your heart today?"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Reflection</label>
                <textarea
                  value={currentEntry.content}
                  onChange={(e) => setCurrentEntry(prev => ({ ...prev, content: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows={8}
                  placeholder="Pour out your heart, share your thoughts, prayers, and what God is showing you..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Mood</label>
                <select
                  value={currentEntry.mood}
                  onChange={(e) => setCurrentEntry(prev => ({ ...prev, mood: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="joyful">Joyful</option>
                  <option value="peaceful">Peaceful</option>
                  <option value="grateful">Grateful</option>
                  <option value="contemplative">Contemplative</option>
                  <option value="hopeful">Hopeful</option>
                  <option value="struggling">Struggling</option>
                </select>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowEditor(false)}
                  className="btn-secondary px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={saveEntry}
                  className="btn-primary px-4 py-2 rounded-lg"
                >
                  Save Entry
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Journal Entries */}
        {entries.length === 0 ? (
          <div className="text-center py-12">
            <i className="fas fa-feather-alt text-gray-300 text-6xl mb-4"></i>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">Your Journal Awaits</h3>
            <p className="text-gray-500 mb-6">
              Start documenting your spiritual journey. Write about your prayers, thoughts, and what God is teaching you.
            </p>
            <button
              onClick={() => setShowEditor(true)}
              className="btn-primary px-6 py-3 rounded-lg font-medium"
            >
              <i className="fas fa-feather-alt mr-2"></i>
              Write Your First Entry
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {entries.map((entry) => {
              const moodConfig = getMoodIcon(entry.mood)
              return (
                <div key={entry.id} className="dashboard-card">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center ${moodConfig.color}`}>
                        <i className={`${moodConfig.icon} text-sm`}></i>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">{entry.title}</h3>
                        <p className="text-sm text-gray-500">{formatDate(entry.date)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500 capitalize">{entry.mood}</span>
                      <button
                        onClick={() => deleteEntry(entry.id)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <i className="fas fa-trash text-sm"></i>
                      </button>
                    </div>
                  </div>
                  
                  <div className="prose prose-sm max-w-none">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {entry.content}
                    </p>
                  </div>
                  
                  {entry.tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {entry.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
