'use client'

import { useState, useEffect } from 'react'
import { StudyPlanService } from '../../lib/study-plan-service'
import { StudyPlan, UserPlanProgress } from '../../types/study-plan.types'
import { getStudyPlans, createStudyPlan } from '../../lib/study-plan-api'

export default function BibleStudy() {
  const [activeStudyTool, setActiveStudyTool] = useState('reading-plan')
  const [plans, setPlans] = useState<StudyPlan[]>([])
  const [selectedPlan, setSelectedPlan] = useState<StudyPlan | null>(null)
  const [progressMap, setProgressMap] = useState<Record<string, UserPlanProgress>>({})
  const [loadingPlans, setLoadingPlans] = useState(true)
  const [errorLoading, setErrorLoading] = useState<string | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newPlanTitle, setNewPlanTitle] = useState('')
  const [newPlanDescription, setNewPlanDescription] = useState('')
  const [newPlanJson, setNewPlanJson] = useState('[{"day":1,"topic":"Sample","passages":["Genesis 1"]}]')

  useEffect(() => {
    async function loadPlans() {
      try {
        const dbPlans = await getStudyPlans()
        setPlans(dbPlans)
        
        const map: Record<string, UserPlanProgress> = {}
        dbPlans.forEach((p) => {
          map[p.id] = StudyPlanService.getProgress(p.id, p.duration)
        })
        setProgressMap(map)
      } catch (err) {
        console.error(err)
        setErrorLoading('Failed to load study plans from database')
        // Fallback to built-in plans if database fails
        const builtIns = StudyPlanService.getBuiltInPlans()
        setPlans(builtIns)
        const map: Record<string, UserPlanProgress> = {}
        builtIns.forEach((p) => {
          map[p.id] = StudyPlanService.getProgress(p.id, p.duration)
        })
        setProgressMap(map)
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
      const toggleDay = (day: number) => {
        StudyPlanService.toggleDay(selectedPlan.id, day, selectedPlan.duration)
        setProgressMap({ 
          ...progressMap, 
          [selectedPlan.id]: StudyPlanService.getProgress(selectedPlan.id, selectedPlan.duration) 
        })
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
              return (
                <div key={r.day} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleDay(r.day)}
                    />
                    <span className="text-sm">
                      <span className="font-medium">Day {r.day}:</span>{' '}
                      {r.topic || r.passages.join(', ')}
                    </span>
                  </div>
                  {r.topic && (
                    <div className="mt-2 pl-8 text-sm">
                      <p className="font-medium text-amber-700">{r.topic}</p>
                      <ul className="list-disc list-inside">
                        {r.passages.map((p) => (
                          <li key={p}>{p}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )
    }

    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
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
        return (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Study Notes</h3>
            <p className="text-gray-500 text-center py-8">Study notes feature coming soon...</p>
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
                        ? 'bg-blue-500 text-white shadow-md'
                        : 'hover:bg-blue-50 text-gray-700'
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

            {/* Create Plan Modal */}
            {showCreateModal && (
              <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg w-full max-w-lg p-6 shadow-xl">
                  <h3 className="text-lg font-semibold mb-4">Create Custom Plan</h3>
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
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
