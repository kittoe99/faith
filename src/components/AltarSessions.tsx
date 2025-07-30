"use client"

import { useEffect, useState } from 'react'
import { AltarSession, CreateAltarSessionInput } from '../../types/altar.types'
import { AltarSessionService } from '../../lib/altar-session-service'
import { supabase } from '../../lib/supabaseClient'

interface Props {
  altarId: string
  altarName: string
  onBack: () => void
}

type SortOption = 'newest' | 'oldest' | 'activities-high' | 'activities-low'

export default function AltarSessions({ altarId, altarName, onBack }: Props) {
  const [sessions, setSessions] = useState<AltarSession[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<SortOption>('newest')
  const [showAddForm, setShowAddForm] = useState(false)
  const [date, setDate] = useState<string>('')
  const [time, setTime] = useState<string>('')
  const [activities, setActivities] = useState<string[]>([])
  const [notes, setNotes] = useState<string>('')

  const activityOptions = [
    'Prayer', 'Worship', 'Bible Reading', 'Meditation', 'Journaling',
    'Intercession', 'Fasting', 'Thanksgiving', 'Sow Seed'
  ]

  useEffect(() => {
    (async () => {
      try {
        const list = await AltarSessionService.list(altarId)
        setSessions(list)
      } catch (err) {
        console.error(err)
        setError('Failed to load sessions')
      } finally {
        setLoading(false)
      }
    })()
  }, [altarId])

  const toggleActivity = (act: string) => {
    setActivities((prev) => prev.includes(act) ? prev.filter(a => a !== act) : [...prev, act])
  }

  async function handleSave() {
    if (!date || !time) {
      alert('Please select date and time')
      return
    }
    const { data: { user } } = await supabase.auth.getUser()
    const input: CreateAltarSessionInput = {
      altar_id: altarId,
      session_date: date,
      session_time: time + ':00',
      activities,
      notes,
      user_id: user?.id ?? undefined,
    }
    try {
      await AltarSessionService.create(input)
      setDate(''); setTime(''); setActivities([]); setNotes(''); setShowAddForm(false)
      // refresh list
      const list = await AltarSessionService.list(altarId)
      setSessions(list)
    } catch (err) {
      console.error(err)
      alert('Failed to save session')
    }
  }

  const sortedSessions = [...sessions].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.session_date + 'T' + b.session_time).getTime() - new Date(a.session_date + 'T' + a.session_time).getTime()
      case 'oldest':
        return new Date(a.session_date + 'T' + a.session_time).getTime() - new Date(b.session_date + 'T' + b.session_time).getTime()
      case 'activities-high':
        return (b.activities?.length || 0) - (a.activities?.length || 0)
      case 'activities-low':
        return (a.activities?.length || 0) - (b.activities?.length || 0)
      default:
        return 0
    }
  })

  return (
    <section className="content-section active">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="text-purple-600 hover:text-purple-700 text-sm"><i className="fas fa-arrow-left mr-1"></i>Back</button>
          <h2 className="text-2xl font-semibold text-gray-800">{altarName} – Session Logs</h2>
        </div>
        <div>
          <label className="mr-2 text-sm text-gray-600">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="border border-gray-300 rounded-md text-sm px-2 py-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="activities-high">Activities (high→low)</option>
            <option value="activities-low">Activities (low→high)</option>
          </select>
        </div>
              <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 text-sm"
        >
          <i className={`fas ${showAddForm ? 'fa-minus' : 'fa-plus'} mr-2`}></i>{showAddForm ? 'Cancel' : 'Add New Entry'}
        </button>
      </div>

      {/* Add form */}
      {showAddForm && (
        <div className="border rounded-lg p-4 bg-gray-50 mb-6">
          <h4 className="font-medium mb-3 text-gray-800 text-sm">Log New Session</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-700">Date</label>
              <input type="date" value={date} onChange={e=>setDate(e.target.value)}
                className="w-full border border-gray-300 px-2 py-2 rounded-md text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-700">Time</label>
              <input type="time" value={time} onChange={e=>setTime(e.target.value)}
                className="w-full border border-gray-300 px-2 py-2 rounded-md text-sm" />
            </div>
          </div>
          <div className="mb-3">
            <label className="block text-xs font-medium mb-1 text-gray-700">Activities</label>
            <div className="flex flex-wrap gap-2">
              {activityOptions.map(a => (
                <button key={a} type="button" onClick={()=>toggleActivity(a)}
                  className={`px-2 py-1 rounded-full text-xs border ${activities.includes(a)?'bg-amber-500 text-white border-amber-500':'text-gray-600 border-gray-300'}`}>{a}</button>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-xs font-medium mb-1 text-gray-700">Notes</label>
            <textarea value={notes} onChange={e=>setNotes(e.target.value)}
              className="w-full border border-gray-300 px-2 py-2 rounded-md h-20 text-sm" />
          </div>
          <div className="flex gap-3">
            <button onClick={handleSave} className="bg-amber-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-amber-600"><i className="fas fa-save mr-2"></i>Save</button>
            <button onClick={()=>setShowAddForm(false)} className="bg-gray-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-600">Cancel</button>
          </div>
        </div>
      )}

      {loading && (
        <div className="flex justify-center items-center py-12">
          <i className="fas fa-spinner fa-spin text-purple-500 text-3xl" />
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {!loading && !error && (
        <div className="space-y-4">
          {sortedSessions.length === 0 ? (
            <p className="text-center text-gray-500">No sessions yet.</p>
          ) : (
            <ul className="divide-y divide-gray-200 bg-white rounded-xl shadow-lg">
              {sortedSessions.map((s) => (
                <li key={s.id} className="p-4 flex items-start gap-4">
                  <div className="w-28 text-sm text-gray-600">
                    <p>{new Date(s.session_date).toLocaleDateString()}</p>
                    <p>{s.session_time?.substring(0,5)}</p>
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-800 text-sm mb-1 font-medium">{(s.activities || []).join(', ') || 'No activities logged'}</p>
                    {s.notes && <p className="text-gray-600 text-xs whitespace-pre-wrap">{s.notes}</p>}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </section>
  )
}
