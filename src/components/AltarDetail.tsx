'use client'

import { useEffect, useState } from 'react'
import { AltarPractice, AltarSession, CreateAltarSessionInput } from '../../types/altar.types'
import { AltarSessionService } from '../../lib/altar-session-service'
import { supabase } from '../../lib/supabaseClient'

interface Props {
  altar: AltarPractice
  onClose: () => void
}

const activityOptions = [
  'Prayer',
  'Worship',
  'Bible Reading',
  'Meditation',
  'Journaling',
  'Intercession',
  'Fasting',
  'Thanksgiving',
  'Sow Seed',
]

export default function AltarDetail({ altar, onClose }: Props) {
  const [sessions, setSessions] = useState<AltarSession[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showEntries, setShowEntries] = useState(true) // Show entries by default
  const [showAddForm, setShowAddForm] = useState(false)

  // form state
  const [date, setDate] = useState<string>('')
  const [time, setTime] = useState<string>('')
  const [activities, setActivities] = useState<string[]>([])
  const [notes, setNotes] = useState<string>('')

  useEffect(() => {
    refresh()
  }, [])

  async function refresh() {
    try {
      setLoading(true)
      const list = await AltarSessionService.list(altar.id)
      setSessions(list)
    } catch (err) {
      console.error(err)
      setError('Failed to load sessions')
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    if (!date || !time) {
      alert('Please select date and time')
      return
    }
    
    // Get current user id (may be null if not signed in)
    const { data: { user } } = await supabase.auth.getUser()

    const input: CreateAltarSessionInput = {
      altar_id: altar.id,
      session_date: date,
      session_time: time + ':00',
      activities,
      notes,
      user_id: user?.id ?? undefined,
    }
    
    console.log('Attempting to save session:', input)
    
    try {
      const result = await AltarSessionService.create(input)
      console.log('Session saved successfully:', result)
      
      // Clear form
      setDate('')
      setTime('')
      setActivities([])
      setNotes('')
      setShowAddForm(false) // Hide the form after successful save
      
      // Refresh sessions list
      await refresh()
      
      // Show success message
      alert('Session saved successfully!')
    } catch (error) {
      console.error('Error saving session:', error)
      alert(`Failed to save session: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const toggleActivity = (act: string) => {
    setActivities((prev) =>
      prev.includes(act) ? prev.filter((a) => a !== act) : [...prev, act]
    )
  }

  const altarTypes = {
    prayer: { icon: 'fas fa-fire', color: 'text-red-500', title: 'Digital Prayer Altar' },
    worship: { icon: 'fas fa-music', color: 'text-purple-500', title: 'Worship Altar' },
    study: { icon: 'fas fa-book-open', color: 'text-blue-500', title: 'Bible Study Altar' },
    fasting: { icon: 'fas fa-leaf', color: 'text-green-500', title: 'Fasting Altar' },
    service: { icon: 'fas fa-hands-helping', color: 'text-yellow-500', title: 'Service Altar' },
    testimony: { icon: 'fas fa-microphone', color: 'text-pink-500', title: 'Testimony Altar' },
    intercession: { icon: 'fas fa-praying-hands', color: 'text-indigo-500', title: 'Intercession Altar' },
    communion: { icon: 'fas fa-wine-glass-alt', color: 'text-red-600', title: 'Communion Altar' },
    meditation: { icon: 'fas fa-om', color: 'text-teal-500', title: 'Meditation Altar' },
    gratitude: { icon: 'fas fa-heart', color: 'text-rose-500', title: 'Gratitude Altar' },
    community: { icon: 'fas fa-users', color: 'text-cyan-500', title: 'Community Altar' }
  }

  const config = altarTypes[altar.type as keyof typeof altarTypes]

  return (
    <section className="content-section active">
      <div className="w-full max-w-7xl mx-auto">
        <div className="bg-white rounded-lg border border-gray-200 shadow-lg">
        <div className="bg-gradient-to-r from-purple-600 to-amber-600 text-white p-4 sm:p-6 rounded-t-lg">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-3">
              <button 
                onClick={onClose} 
                className="text-white/80 hover:text-white flex-shrink-0 mr-3"
                title="Back to Altar List"
              >
                <i className="fas fa-arrow-left text-lg sm:text-xl" />
              </button>
              <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0`}>
                <i className={`${config.icon} text-lg sm:text-2xl text-white`}></i>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-lg sm:text-2xl font-bold text-white">{altar.name}</h3>
                <p className="text-sm sm:text-base text-white/90">{config.title}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Altar Details Section */}
        <div className="p-4 sm:p-6">
          <div className="mb-6">
            <h4 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">Purpose</h4>
            <p className="text-sm sm:text-base text-gray-600 bg-gray-50 p-4 rounded-lg">{altar.purpose}</p>
          </div>
          
          {/* Altar Practices */}
          {altar.practices && altar.practices.length > 0 && (
            <div className="mb-3 sm:mb-4">
              <h5 className="font-medium text-gray-700 mb-2 text-sm sm:text-base">Sacred Practices:</h5>
              <div className="flex flex-wrap gap-1 sm:gap-2">
                {altar.practices.map((practice, index) => (
                  <span key={index} className="bg-purple-100 text-purple-700 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
                    {practice}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* Altar Sacrifices */}
          {altar.sacrifices && altar.sacrifices.length > 0 && (
            <div className="mb-3 sm:mb-4">
              <h5 className="font-medium text-gray-700 mb-2 text-sm sm:text-base">Sacrifices:</h5>
              <div className="flex flex-wrap gap-1 sm:gap-2">
                {altar.sacrifices.map((sacrifice, index) => (
                  <span key={index} className="bg-amber-100 text-amber-700 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
                    {sacrifice}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* Custom Items */}
          {altar.custom_items && altar.custom_items.length > 0 && (
            <div className="mb-3 sm:mb-4">
              <h5 className="font-medium text-gray-700 mb-2 text-sm sm:text-base">Custom Items:</h5>
              <div className="flex flex-wrap gap-1 sm:gap-2">
                {altar.custom_items.map((item, index) => (
                  <span key={index} className="bg-gray-100 text-gray-700 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center text-xs sm:text-sm text-gray-500">
              <i className="fas fa-calendar-alt mr-2"></i>
              Created on {new Date(altar.created_at).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Entries Section */}
        <div className="border-t bg-gray-50 p-4 sm:p-6 rounded-b-lg">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0 mb-4">
            <h4 className="text-base sm:text-lg font-semibold text-gray-800">Session Entries</h4>
            <button
              onClick={() => setShowEntries(!showEntries)}
              className="bg-purple-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm sm:text-base"
            >
              <i className={`fas ${showEntries ? 'fa-eye-slash' : 'fa-eye'} mr-2`}></i>
              <span className="hidden sm:inline">{showEntries ? 'Hide Entries' : 'View Entries'}</span>
              <span className="sm:hidden">{showEntries ? 'Hide' : 'View'}</span>
              <span className="ml-1">({sessions.length})</span>
            </button>
          </div>

          {showEntries && (
            <div className="space-y-4 sm:space-y-6">
              {/* Add New Entry Button */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0">
                <h5 className="font-medium text-gray-700 text-sm sm:text-base">Session Records</h5>
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="bg-amber-500 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors text-sm sm:text-base"
                >
                  <i className={`fas ${showAddForm ? 'fa-minus' : 'fa-plus'} mr-2`}></i>
                  <span className="hidden sm:inline">{showAddForm ? 'Cancel' : 'Add New Entry'}</span>
                  <span className="sm:hidden">{showAddForm ? 'Cancel' : 'Add'}</span>
                </button>
              </div>

              {/* Add Form */}
              {showAddForm && (
                <div className="border rounded-lg p-3 sm:p-4 bg-gray-50">
                  <h6 className="font-medium mb-3 text-gray-800 text-sm sm:text-base">Log New Session</h6>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-3">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium mb-1 text-gray-700">Date</label>
                      <input 
                        type="date" 
                        value={date} 
                        onChange={(e) => setDate(e.target.value)} 
                        className="w-full border border-gray-300 px-2 sm:px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium mb-1 text-gray-700">Time</label>
                      <input 
                        type="time" 
                        value={time} 
                        onChange={(e) => setTime(e.target.value)} 
                        className="w-full border border-gray-300 px-2 sm:px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm" 
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="block text-xs sm:text-sm font-medium mb-1 text-gray-700">Activities</label>
                    <div className="flex flex-wrap gap-1 sm:gap-2">
                      {activityOptions.map((a) => (
                        <button
                          key={a}
                          type="button"
                          onClick={() => toggleActivity(a)}
                          className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm border transition-colors ${
                            activities.includes(a) 
                              ? 'bg-amber-500 text-white border-amber-500' 
                              : 'text-gray-600 border-gray-300 hover:border-amber-500'
                          }`}
                        >
                          {a}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-xs sm:text-sm font-medium mb-1 text-gray-700">Notes</label>
                    <textarea 
                      value={notes} 
                      onChange={(e) => setNotes(e.target.value)} 
                      className="w-full border border-gray-300 px-2 sm:px-3 py-2 rounded-md h-20 sm:h-24 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm" 
                      placeholder="Describe your spiritual experience, insights, or reflections..."
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <button 
                      onClick={handleSave} 
                      className="bg-amber-500 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-amber-600 transition-colors text-sm sm:text-base"
                    >
                      <i className="fas fa-save mr-2"></i>Save Entry
                    </button>
                    <button 
                      onClick={() => setShowAddForm(false)} 
                      className="bg-gray-500 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors text-sm sm:text-base"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Sessions List */}
              {loading ? (
                <div className="flex justify-center items-center py-6 sm:py-8">
                  <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-t-2 border-b-2 border-purple-500"></div>
                  <span className="ml-3 text-gray-600 text-sm sm:text-base">Loading sessions...</span>
                </div>
              ) : error ? (
                <div className="bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-3 rounded-lg text-sm sm:text-base">
                  <i className="fas fa-exclamation-triangle mr-2"></i>{error}
                </div>
              ) : sessions.length === 0 ? (
                <div className="text-center py-6 sm:py-8 text-gray-500">
                  <i className="fas fa-journal-whills text-3xl sm:text-4xl mb-3 text-gray-300"></i>
                  <p className="text-sm sm:text-base">No session entries yet.</p>
                  <p className="text-xs sm:text-sm">Click "Add New Entry" to log your first spiritual session.</p>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {sessions.map((s) => (
                    <div key={s.id} className="border border-gray-200 rounded-lg p-3 sm:p-4 bg-white hover:shadow-md transition-shadow">
                      <div className="flex items-start space-x-3 mb-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <i className="fas fa-calendar-day text-amber-600 text-sm sm:text-base"></i>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-amber-600 text-sm sm:text-base">
                            {new Date(s.session_date).toLocaleDateString()} @ {s.session_time.slice(0,5)}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-500">
                            {s.activities.length > 0 ? s.activities.join(', ') : 'No activities specified'}
                          </p>
                        </div>
                      </div>
                      {s.notes && (
                        <div className="mt-3 p-2 sm:p-3 bg-gray-50 rounded-md">
                          <p className="text-xs sm:text-sm text-gray-700 whitespace-pre-wrap">{s.notes}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        </div>
      </div>
    </section>
  )
}
