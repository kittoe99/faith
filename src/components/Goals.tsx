'use client'

import { useState, useEffect } from 'react'
import { SpiritualGoalsService } from '../../lib/spiritual-goals-service'
import { SpiritualGoal, CreateSpiritualGoalInput } from '../../types/goal.types'

export default function Goals() {
  const [goals, setGoals] = useState<SpiritualGoal[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newGoal, setNewGoal] = useState<CreateSpiritualGoalInput>({
    title: '',
    description: '',
    target_date: '',
  })

  useEffect(() => {
    refresh()
  }, [])

  async function refresh() {
    try {
      setLoading(true)
      const list = await SpiritualGoalsService.list()
      setGoals(list)
    } catch (err) {
      console.error('Failed to load goals', err)
      alert('Failed to load goals')
    } finally {
      setLoading(false)
    }
  }

  async function handleAdd() {
    if (!newGoal.title.trim()) {
      alert('Please enter goal title')
      return
    }
    try {
      await SpiritualGoalsService.create(newGoal)
      setNewGoal({ title: '', description: '', target_date: '' })
      setShowAddForm(false)
      await refresh()
    } catch (err) {
      console.error('Failed to create goal', err)
      alert('Failed to create goal')
    }
  }

  async function toggleComplete(goal: SpiritualGoal) {
    try {
      await SpiritualGoalsService.update(goal.id, { completed: !goal.completed })
      await refresh()
    } catch (err) {
      console.error('Failed to update goal', err)
      alert('Failed to update goal')
    }
  }

  async function deleteGoal(id: string) {
    if (!confirm('Delete this goal?')) return
    try {
      await SpiritualGoalsService.delete(id)
      await refresh()
    } catch (err) {
      console.error('Failed to delete goal', err)
      alert('Failed to delete goal')
    }
  }

  return (
    <section className="content-section active">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-purple-600 to-amber-500 rounded-lg p-6 text-white shadow-lg mb-8 flex justify-between items-center flex-col sm:flex-row gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-wide flex items-center gap-3">
            <i className="fas fa-bullseye text-2xl"></i>
            Spiritual Goals
          </h2>
          <p className="opacity-90 mt-1">Set, track, and celebrate milestones in your walk with God.</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-5 py-2.5 rounded-md bg-white/20 hover:bg-white/30 transition text-white font-medium shadow flex items-center gap-2"
        >
          <i className={`fas ${showAddForm ? 'fa-minus' : 'fa-plus'}`}></i>
          {showAddForm ? 'Cancel' : 'Add Goal'}
        </button>
      </div>


      {showAddForm && (
        <div className="mb-6 bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={newGoal.title}
              onChange={(e) => setNewGoal((g) => ({ ...g, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={newGoal.description}
              onChange={(e) => setNewGoal((g) => ({ ...g, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Target Date</label>
            <input
              type="date"
              value={newGoal.target_date || ''}
              onChange={(e) => setNewGoal((g) => ({ ...g, target_date: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Save Goal
          </button>
        </div>
      )}

      {loading ? (
        <div>Loading...</div>
      ) : goals.length === 0 ? (
        <p>No goals yet.</p>
      ) : (
        <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal) => (
            <li
              key={goal.id}
              className={`relative overflow-hidden rounded-xl shadow-lg border-l-8 p-5 flex flex-col gap-4 ${goal.completed ? 'border-green-500 bg-green-50' : 'border-purple-500 bg-white'}`}
            >
              <div>
                <h3 className={`font-semibold text-xl flex items-center gap-2 ${goal.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                    <i className="fas fa-check-circle"></i>
                    {goal.title}
                  </h3>
                {goal.description && <p className="text-gray-600 mt-1">{goal.description}</p>}
                {goal.target_date && (
                  <p className="text-sm text-gray-500 mt-1">
                    Target: {new Date(goal.target_date).toLocaleDateString()}
                  </p>
                )}
              </div>
              <div className="mt-auto flex items-center gap-2">
                <button
                  onClick={() => toggleComplete(goal)}
                  className={`px-3 py-1 rounded-md text-sm font-medium ${goal.completed ? 'bg-yellow-500/90 hover:bg-yellow-600' : 'bg-green-600/90 hover:bg-green-700'} text-white transition`}
                >
                  {goal.completed ? 'Mark Incomplete' : 'Mark Complete'}
                </button>
                <button
                  onClick={() => deleteGoal(goal.id)}
                  className="px-3 py-1 rounded-md text-sm bg-red-600/90 hover:bg-red-700 text-white transition"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
