'use client'

import { useState, useEffect } from 'react'

interface SpiritualTask {
  id: string
  title: string
  description: string
  dueDate: string
  priority: 'low' | 'medium' | 'high'
  completed: boolean
  createdAt: string
}

export default function Tasks() {
  const [tasks, setTasks] = useState<SpiritualTask[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium' as 'low' | 'medium' | 'high'
  })

  useEffect(() => {
    // Load tasks from localStorage
    const savedTasks = localStorage.getItem('spiritualTasks')
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks))
    }
  }, [])

  const saveTasks = (updatedTasks: SpiritualTask[]) => {
    setTasks(updatedTasks)
    localStorage.setItem('spiritualTasks', JSON.stringify(updatedTasks))
  }

  const addTask = () => {
    if (!newTask.title.trim()) return

    const task: SpiritualTask = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      dueDate: newTask.dueDate,
      priority: newTask.priority,
      completed: false,
      createdAt: new Date().toISOString()
    }

    saveTasks([...tasks, task])
    setNewTask({ title: '', description: '', dueDate: '', priority: 'medium' })
    setShowAddForm(false)
  }

  const toggleTask = (taskId: string) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    )
    saveTasks(updatedTasks)
  }

  const deleteTask = (taskId: string) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId)
    saveTasks(updatedTasks)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const activeTasks = tasks.filter(task => !task.completed)
  const completedTasks = tasks.filter(task => task.completed)

  return (
    <section className="content-section active">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Spiritual Goals</h2>
            <p className="text-gray-600">Set and track your spiritual objectives and growth targets</p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="btn-primary px-6 py-3 rounded-lg font-medium"
          >
            <i className="fas fa-plus mr-2"></i>
            Add Goal
          </button>
        </div>

        {/* Add Task Form */}
        {showAddForm && (
          <div className="dashboard-card mb-6">
            <h3 className="text-lg font-semibold mb-4">Add New Spiritual Goal</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Goal Title</label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g., Read through Psalms, Fast for 7 days"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows={3}
                  placeholder="Describe your spiritual goal and why it's important"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask(prev => ({ ...prev, dueDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask(prev => ({ ...prev, priority: e.target.value as 'low' | 'medium' | 'high' }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="btn-secondary px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={addTask}
                  className="btn-primary px-4 py-2 rounded-lg"
                >
                  Add Goal
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Active Tasks */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <i className="fas fa-clock text-blue-500 mr-2"></i>
            Active Goals ({activeTasks.length})
          </h3>
          
          {activeTasks.length === 0 ? (
            <div className="text-center py-8 dashboard-card">
              <i className="fas fa-bullseye text-gray-300 text-4xl mb-3"></i>
              <p className="text-gray-500">No active spiritual goals. Set your first goal to begin!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activeTasks.map((task) => (
                <div key={task.id} className="dashboard-card">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <button
                        onClick={() => toggleTask(task.id)}
                        className="mt-1 w-5 h-5 border-2 border-gray-300 rounded hover:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        {task.completed && <i className="fas fa-check text-purple-600 text-xs"></i>}
                      </button>
                      
                      <div className="flex-1">
                        <h4 className="text-lg font-medium text-gray-800">{task.title}</h4>
                        {task.description && (
                          <p className="text-gray-600 text-sm mt-1">{task.description}</p>
                        )}
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                          {task.dueDate && (
                            <span className="flex items-center">
                              <i className="fas fa-calendar mr-1"></i>
                              Due: {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                          )}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Completed Tasks */}
        {completedTasks.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <i className="fas fa-check-circle text-green-500 mr-2"></i>
              Completed Goals ({completedTasks.length})
            </h3>
            
            <div className="space-y-4">
              {completedTasks.map((task) => (
                <div key={task.id} className="dashboard-card opacity-75">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <button
                        onClick={() => toggleTask(task.id)}
                        className="mt-1 w-5 h-5 bg-green-500 rounded flex items-center justify-center"
                      >
                        <i className="fas fa-check text-white text-xs"></i>
                      </button>
                      
                      <div className="flex-1">
                        <h4 className="text-lg font-medium text-gray-600 line-through">{task.title}</h4>
                        {task.description && (
                          <p className="text-gray-500 text-sm mt-1">{task.description}</p>
                        )}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
