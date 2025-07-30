'use client'

import Modal from './ui/Modal'
import { useState, useEffect } from 'react'
import { StudyPlanService } from '../../lib/study-plan-service'
import { StudyPlanProgressService } from '../../lib/study-plan-progress-service'
import StudyNotes from './StudyNotes'
import { fetchPassage } from '../../lib/bible-api'
import { StudyPlan, UserPlanProgress } from '../../types/study-plan.types'
import { getStudyPlans, createStudyPlan } from '../../lib/study-plan-api'

export default function BibleStudy() {
  const [activeStudyTool, setActiveStudyTool] = useState('reading-plan')
  const [plans, setPlans] = useState<StudyPlan[]>([])
  const [verseCache, setVerseCache] = useState<Record<string, string>>( {})  // key: reference, value: text
  const [expanded, setExpanded] = useState<Record<number, boolean>>({})
  const [selectedPlan, setSelectedPlan] = useState<StudyPlan | null>(null)
  const [progressMap, setProgressMap] = useState<Record<string, UserPlanProgress>>({})
  const [loadingPlans, setLoadingPlans] = useState(true)
  const [errorLoading, setErrorLoading] = useState<string | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newPlanTitle, setNewPlanTitle] = useState('')
  const [newPlanDescription, setNewPlanDescription] = useState('')
  const [newPlanJson, setNewPlanJson] = useState('[{"day":1,"topic":"Sample","passages":["Genesis 1"]}]')
  const [readingModal, setReadingModal] = useState<{ day: number; reading: any } | null>(null)
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set())
  const [fontSize, setFontSize] = useState('text-base')

  const toggleBookmark = (verseKey: string) => {
    const newBookmarks = new Set(bookmarks)
    if (newBookmarks.has(verseKey)) {
      newBookmarks.delete(verseKey)
    } else {
      newBookmarks.add(verseKey)
    }
    setBookmarks(newBookmarks)
  }

  const openEnhancedReadingModal = async (day: number, reading: any) => {
    setReadingModal({ day, reading })
    // Pre-load all passages for the enhanced modal
    for (const ref of reading.passages) {
      if (!verseCache[ref]) {
        try {
          const verses = await fetchPassage(ref)
          const text = verses.map(v => `${v.reference} ${v.text}`).join('\n')
          setVerseCache(prev => ({ ...prev, [ref]: text }))
        } catch (err) {
          console.error('Failed to load passage:', ref, err)
        }
      }
    }
  }

  useEffect(() => {
    async function loadPlans() {
      try {
        const dbPlans = await getStudyPlans()
        setPlans(dbPlans)
        
        const entries = await Promise.all(
          dbPlans.map(async (p) => [p.id, await StudyPlanProgressService.getProgress(p.id, p.duration)] as const)
        )
        setProgressMap(Object.fromEntries(entries))
      } catch (err) {
        console.error(err)
        setErrorLoading('Failed to load study plans from database')
        // Fallback to built-in plans if database fails
        const builtIns = StudyPlanService.getBuiltInPlans()
        setPlans(builtIns)
        const entries = await Promise.all(
          builtIns.map(async (p) => [p.id, await StudyPlanProgressService.getProgress(p.id, p.duration)] as const)
        )
        setProgressMap(Object.fromEntries(entries))
      } finally {
        setLoadingPlans(false)
      }
    }
    loadPlans()
  }, [])

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
    }
  ]

  const renderReadingPlans = () => {
    if (selectedPlan) {
      const progress = progressMap[selectedPlan.id]
      const toggleDay = async (day: number) => {
        await StudyPlanProgressService.toggleDay(selectedPlan.id, day, selectedPlan.duration)
        const updated = await StudyPlanProgressService.getProgress(selectedPlan.id, selectedPlan.duration)
        setProgressMap({ ...progressMap, [selectedPlan.id]: updated })
      }

      return (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <button 
            className="text-sm text-amber-600 mb-4" 
            onClick={() => setSelectedPlan(null)}
          >
            <i className="fas fa-chevron-left mr-1" />Back to plans
          </button>
          <h3 className="text-2xl font-semibold mb-2">{selectedPlan.title}</h3>
          <p className="text-gray-600 mb-4">{selectedPlan.description}</p>
          
          <div className="w-full bg-gray-100 rounded-full h-3 mb-6">
            <div 
              className="bg-amber-500 h-3 rounded-full" 
              style={{ width: `${Math.round((progress.completedDays.length / selectedPlan.duration) * 100)}%` }} 
            />
          </div>
          
          <div className="max-h-96 overflow-y-auto space-y-2 mb-6">
            {selectedPlan.readings.map((r) => {
              const checked = progress.completedDays.includes(r.day)
              const isOpen = expanded[r.day]
              
              return (
                <div key={r.day} className="border border-gray-200 rounded-lg p-3">
                  <div
                    className="flex items-center justify-between"
                    onClick={() => openEnhancedReadingModal(r.day, r)}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleDay(r.day)}
                        onClick={e => e.stopPropagation()}
                      />
                      <div className="flex-1">
                        <span className="text-sm font-medium">Day {r.day}</span>
                        {(r.heading || r.topic) && <span className="text-xs text-amber-600 ml-2 font-semibold">- {r.heading || r.topic}</span>}
                        <div className="text-xs text-gray-500 mt-1">
                          {r.passages.join(', ')}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <i className="fas fa-book-open text-amber-500 text-sm"></i>
                      <i className="fas fa-chevron-right text-gray-400 text-sm"></i>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )
    }

    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-4 sticky top-0 bg-white z-10 border-b pb-2">
          <h3 className="text-xl font-semibold">Bible Reading Plans</h3>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-3 py-1 bg-amber-500 text-white text-sm rounded hover:bg-amber-600"
          >
            <i className="fas fa-plus mr-1" />Create custom
          </button>
        </div>
        
        {loadingPlans && <p className="text-center py-6">Loading plans...</p>}
        {errorLoading && <p className="text-center text-red-500 py-6">{errorLoading}</p>}
        
        {!loadingPlans && !errorLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {plans.map((plan) => {
              const progress = progressMap[plan.id]
              const pct = progress ? Math.round((progress.completedDays.length / plan.duration) * 100) : 0
              const completed = progress?.completed
              
              return (
                <div
                  key={plan.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedPlan(plan)}
                >
                  <h4 className="font-semibold text-amber-600 mb-2">{plan.title}</h4>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-3">{plan.description}</p>
                  <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
                    <div className="bg-amber-500 h-2 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-xs text-gray-500">
                    {completed ? 'Completed' : `${pct}% complete`}
                  </span>
                  <button
                    onClick={() => setSelectedPlan(plan)}
                    className={`mt-2 w-full px-3 py-2 rounded text-sm font-medium transition-colors ${completed || progress.completedDays.length > 0 ? 'bg-gray-200 text-gray-600 hover:bg-gray-300' : 'bg-amber-500 text-white hover:bg-amber-600'}`}
                  >
                    {completed || progress.completedDays.length > 0 ? 'Continue Plan' : 'Start Plan'}
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  const renderStudyTool = () => {
    switch (activeStudyTool) {
      case 'reading-plan':
        return renderReadingPlans()
      case 'study-notes':
        return <StudyNotes />
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
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Study Tools</h3>
              <div className="space-y-2">
                {studyTools.map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => setActiveStudyTool(tool.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      activeStudyTool === tool.id
                        ? 'bg-amber-500 text-white shadow-md'
                        : 'hover:bg-gray-50'
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
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {renderStudyTool()}

            {/* Enhanced Reading Modal */}
            {readingModal && (
              <Modal 
                open={true} 
                onClose={() => setReadingModal(null)} 
                title={
                  <div className="flex items-center justify-between w-full">
                    <div>
                      <span className="text-xl font-semibold">Day {readingModal.day}</span>
                      {(readingModal.reading.heading || readingModal.reading.topic) && (
                        <span className="text-sm text-amber-600 ml-2 font-medium">- {readingModal.reading.heading || readingModal.reading.topic}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setFontSize(fontSize === 'text-sm' ? 'text-base' : fontSize === 'text-base' ? 'text-lg' : 'text-sm')}
                        className="p-2 text-gray-600 hover:text-amber-600 transition-colors"
                        title="Toggle Font Size"
                      >
                        <i className="fas fa-text-height"></i>
                      </button>
                    </div>
                  </div>
                }
                widthClass="max-w-4xl"
              >
                <div className="space-y-8">
                  {readingModal.reading.passages.map((ref: string) => (
                    <div key={ref} className="border-b border-gray-100 pb-6 last:border-b-0">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-amber-600">{ref}</h3>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">
                            {verseCache[ref] ? `${verseCache[ref].split('\n').length} verses` : 'Loading...'}
                          </span>
                        </div>
                      </div>
                      
                      {verseCache[ref] ? (
                        <div className={`space-y-2 ${fontSize} leading-relaxed`}>
                          {verseCache[ref].split('\n').filter(line => line.trim()).map((line, idx) => {
                            // Handle different verse formats: "Book Chapter:Verse Text" or "Chapter:Verse Text"
                            const verseMatch = line.match(/^(.+?)\s+(\d+:\d+)\s+(.+)$/)
                            if (verseMatch) {
                              const [, book, verseRef, verseText] = verseMatch
                              const verseKey = `${ref}-${verseRef}`
                              const isBookmarked = bookmarks.has(verseKey)
                              
                              return (
                                <div key={idx} className="flex group hover:bg-amber-50 p-3 rounded-lg transition-colors">
                                  <span className="font-bold text-amber-600 mr-4 w-16 flex-shrink-0 text-sm">
                                    {verseRef}
                                  </span>
                                  <span className="text-gray-800 flex-1">{verseText}</span>
                                  <div className="opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                                    <button 
                                      onClick={() => toggleBookmark(verseKey)}
                                      className={`p-1 transition-colors ${
                                        isBookmarked 
                                          ? 'text-amber-500 hover:text-amber-600' 
                                          : 'text-gray-400 hover:text-amber-500'
                                      }`}
                                      title={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
                                    >
                                      <i className={`fas fa-bookmark text-xs ${isBookmarked ? '' : 'far'}`}></i>
                                    </button>
                                  </div>
                                </div>
                              )
                            }
                            
                            // Handle simple "Chapter:Verse Text" format
                            const simpleMatch = line.match(/^(\d+:\d+)\s+(.+)$/)
                            if (simpleMatch) {
                              const [, verseRef, verseText] = simpleMatch
                              const verseKey = `${ref}-${verseRef}`
                              const isBookmarked = bookmarks.has(verseKey)
                              
                              return (
                                <div key={idx} className="flex group hover:bg-amber-50 p-3 rounded-lg transition-colors">
                                  <span className="font-bold text-amber-600 mr-4 w-16 flex-shrink-0 text-sm">
                                    {verseRef}
                                  </span>
                                  <span className="text-gray-800 flex-1">{verseText}</span>
                                  <div className="opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                                    <button 
                                      onClick={() => toggleBookmark(verseKey)}
                                      className={`p-1 transition-colors ${
                                        isBookmarked 
                                          ? 'text-amber-500 hover:text-amber-600' 
                                          : 'text-gray-400 hover:text-amber-500'
                                      }`}
                                      title={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
                                    >
                                      <i className={`fas fa-bookmark text-xs ${isBookmarked ? '' : 'far'}`}></i>
                                    </button>
                                  </div>
                                </div>
                              )
                            }
                            
                            // If no verse pattern matches, skip this line or treat as continuation
                            return null
                          })}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <i className="fas fa-spinner fa-spin text-amber-500 text-xl mb-2"></i>
                          <p className="text-gray-500">Loading verses...</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                {/* Reading Progress Footer */}
                <div className="bg-gray-50 px-6 py-4 mt-6 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      <i className="fas fa-book-open mr-2 text-amber-500"></i>
                      Day {readingModal.day} Reading Complete
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-500">
                        {readingModal.reading.passages.length} passage{readingModal.reading.passages.length !== 1 ? 's' : ''}
                      </span>
                      <button
                        onClick={() => setReadingModal(null)}
                        className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors text-sm"
                      >
                        Mark as Read
                      </button>
                    </div>
                  </div>
                </div>
              </Modal>
            )}

            {/* Create Plan Modal */}
            {showCreateModal && (
              <Modal open={true} onClose={() => setShowCreateModal(false)} title="Create Custom Plan">
                <div className="space-y-4">
                  <input
                    type="text"
                    className="w-full border px-3 py-2 rounded"
                    placeholder="Title"
                    value={newPlanTitle}
                    onChange={(e) => setNewPlanTitle(e.target.value)}
                  />
                  <textarea
                    className="w-full border px-3 py-2 rounded"
                    placeholder="Description"
                    value={newPlanDescription}
                    onChange={(e) => setNewPlanDescription(e.target.value)}
                  />
                  <textarea
                    className="w-full border px-3 py-2 rounded font-mono text-xs h-40"
                    placeholder="Readings JSON (array of day objects)"
                    value={newPlanJson}
                    onChange={(e) => setNewPlanJson(e.target.value)}
                  />
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    className="px-4 py-2 bg-gray-200 rounded"
                    onClick={() => setShowCreateModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-amber-500 text-white rounded"
                    onClick={async () => {
                      try {
                        const readings = JSON.parse(newPlanJson)
                        const plan: Omit<StudyPlan, 'id'> = {
                          title: newPlanTitle,
                          description: newPlanDescription,
                          duration: readings.length,
                          readings,
                        }
                        const id = await createStudyPlan(plan)
                        if (id) {
                          setPlans([...plans, { id, ...plan } as StudyPlan])
                          setShowCreateModal(false)
                          setNewPlanTitle('')
                          setNewPlanDescription('')
                          setNewPlanJson('[{"day":1,"topic":"Sample","passages":["Genesis 1"]}]')
                        }
                      } catch (err: any) {
                        alert('Invalid JSON or error saving plan')
                      }
                    }}
                  >
                    Save
                  </button>
                </div>
              </Modal>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
