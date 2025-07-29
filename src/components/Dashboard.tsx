'use client'

import { useState, useEffect } from 'react'
import { TasksService } from '../../lib/tasks-service'
import { JournalService } from '../../lib/journal-service'
import { AltarSessionService } from '../../lib/altar-session-service'

export default function Dashboard() {
    const [altarLogs, setAltarLogs] = useState<any[]>([])
  const [upcomingTasks, setUpcomingTasks] = useState<any[]>([])
  const [journalCount, setJournalCount] = useState(0)

  useEffect(() => {
        const loadDashboardData = async () => {
      try {
        // fetch altar sessions
        const sessions = await AltarSessionService.listRecent(5)
        setAltarLogs(sessions)

        // fetch tasks
        const tasks = await TasksService.list()
        const upcoming = tasks
          .filter((t:any)=> !t.completed && t.due_date)
          .sort((a:any,b:any)=> new Date(a.due_date).getTime()-new Date(b.due_date).getTime())
          .slice(0,5)
        setUpcomingTasks(upcoming)

        // journal count
        const journals = await JournalService.list()
        setJournalCount(journals.length)
      } catch (error) {
        console.error('Error loading dashboard data:', error)
      }
    }

    loadDashboardData()
  }, [])

  const formatRelativeTime = (date: string) => {
    const now = new Date()
    const targetDate = new Date(date)
    const diffTime = Math.abs(now.getTime() - targetDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return '1 day ago'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`
    return `${Math.ceil(diffDays / 30)} months ago`
  }

  const getAltarTypeConfig = (type: string) => {
    const configs: { [key: string]: { icon: string; color: string; title: string } } = {
      prayer: { icon: 'fas fa-fire', color: 'text-red-500', title: 'Prayer Altar' },
      worship: { icon: 'fas fa-music', color: 'text-purple-500', title: 'Worship Altar' },
      study: { icon: 'fas fa-book-open', color: 'text-blue-500', title: 'Study Altar' },
      fasting: { icon: 'fas fa-leaf', color: 'text-green-500', title: 'Fasting Altar' },
      service: { icon: 'fas fa-hands-helping', color: 'text-yellow-500', title: 'Service Altar' },
      testimony: { icon: 'fas fa-microphone', color: 'text-pink-500', title: 'Testimony Altar' },
      intercession: { icon: 'fas fa-praying-hands', color: 'text-indigo-500', title: 'Intercession Altar' },
      communion: { icon: 'fas fa-wine-glass-alt', color: 'text-red-600', title: 'Communion Altar' },
      meditation: { icon: 'fas fa-om', color: 'text-teal-500', title: 'Meditation Altar' },
      gratitude: { icon: 'fas fa-heart', color: 'text-rose-500', title: 'Gratitude Altar' },
      community: { icon: 'fas fa-users', color: 'text-cyan-500', title: 'Community Altar' }
    }
    return configs[type] || { icon: 'fas fa-altar', color: 'text-gray-500', title: 'Altar' }
  }

  return (
    <section id="home" className="content-section active">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Altar Logs */}
        <div className="dashboard-card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-800">
              <i className="fas fa-fire text-orange-500 mr-2"></i>
              Recent Altar Logs
            </h3>
            <a href="#altar" className="text-primary hover:text-purple-700 font-medium">
              View All →
            </a>
          </div>
          
          {altarLogs.length > 0 ? (
            <div className="space-y-4">
              {altarLogs.map((log, index) => {
                const config = getAltarTypeConfig(log.altarType)
                return (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full bg-white flex items-center justify-center ${config.color}`}>
                      <i className={`${config.icon} text-sm`}></i>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{log.altarName}</p>
                      <p className="text-xs text-gray-500">{formatRelativeTime(log.date)}</p>
                      {log.reflection && (
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {log.reflection.substring(0, 100)}...
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <i className="fas fa-fire text-gray-300 text-4xl mb-3"></i>
              <p className="text-gray-500">No altar logs yet. Start your spiritual journey!</p>
              <a href="#altar" className="inline-block mt-3 px-4 py-2 bg-primary text-white rounded-lg hover:bg-purple-700 transition-colors">
                Create Your First Altar
              </a>
            </div>
          )}
        </div>

        {/* Upcoming Tasks */}
        <div className="dashboard-card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-800">
              <i className="fas fa-bullseye text-green-500 mr-2"></i>
              Upcoming Tasks
            </h3>
            <a href="#tasks" className="text-primary hover:text-purple-700 font-medium">
              View All →
            </a>
          </div>
          
          {upcomingTasks.length > 0 ? (
            <div className="space-y-4">
              {upcomingTasks.map((task, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{task.title}</p>
                    <p className="text-xs text-gray-500">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      task.priority === 'high' ? 'bg-red-100 text-red-800' :
                      task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <i className="fas fa-bullseye text-gray-300 text-4xl mb-3"></i>
              <p className="text-gray-500">No tasks set yet.</p>
              <a href="#tasks" className="inline-block mt-3 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                Add Your First Task
              </a>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="dashboard-card lg:col-span-2">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">
            <i className="fas fa-chart-line text-blue-500 mr-2"></i>
            Spiritual Journey Overview
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{altarLogs.length}</div>
              <div className="text-sm text-blue-700">Altar Entries</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{upcomingTasks.length}</div>
              <div className="text-sm text-green-700">Active Goals</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{journalCount}</div>
              <div className="text-sm text-purple-700">Journal Entries</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
              
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
