'use client'

import { useState, useEffect } from 'react'
import { AltarPracticeService } from '../../lib/altar-practice-service'
import { AltarPractice as AltarPracticeType, AltarFormData } from '../../types/altar.types'



export default function AltarPractice() {
  const [currentStep, setCurrentStep] = useState(1)
  const [showSuccess, setShowSuccess] = useState(false)
  const [formData, setFormData] = useState<AltarFormData>({
    name: '',
    type: 'prayer',
    purpose: '',
    customPurpose: '',
    practices: [],
    sacrifices: [],
    customItems: []
  })
  const [customItemInput, setCustomItemInput] = useState('')
  const [view, setView] = useState('list') // 'list', 'create', 'detail'
  const [altars, setAltars] = useState<AltarPracticeType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

  const practices = [
    'Silent Prayer', 'Spoken Prayer', 'Singing/Worship', 'Bible Reading',
    'Meditation', 'Journaling', 'Confession', 'Thanksgiving',
    'Intercession', 'Fasting', 'Scripture Memorization', 'Testimony Sharing'
  ]

  const sacrifices = [
    'Time (specific hours)', 'Fasting from food', 'Fasting from entertainment',
    'Fasting from social media', 'Financial offering', 'Acts of service',
    'Giving up comfort', 'Sacrificing sleep for prayer', 'Abstaining from pleasures',
    'Dedicating talents/skills', 'Sacrificing personal desires', 'Giving up social activities'
  ]

  useEffect(() => {
    const fetchAltars = async () => {
      try {
        setLoading(true)
        const data = await AltarPracticeService.getAltarPractices()
        setAltars(data)
      } catch (err) {
        console.error('Error fetching altar practices:', err)
        setError('Failed to load altar practices')
      } finally {
        setLoading(false)
      }
    }

    fetchAltars()
  }, [])

  const updateProgressIndicators = (step: number) => {
    return { width: `${step * 25}%` }
  }

  const handleNext = () => {
    if (currentStep === 1) {
      if (!formData.name.trim()) {
        alert('Please enter an altar name')
        return
      }
      if (!formData.purpose.trim() && !formData.customPurpose.trim()) {
        alert('Please select or enter a purpose')
        return
      }
    }
    
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleInputChange = (field: keyof AltarFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleCheckboxChange = (field: 'practices' | 'sacrifices', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }))
  }

  const addCustomItem = () => {
    if (customItemInput.trim()) {
      setFormData(prev => ({
        ...prev,
        customItems: [...prev.customItems, customItemInput.trim()]
      }))
      setCustomItemInput('')
    }
  }

  const removeCustomItem = (item: string) => {
    setFormData(prev => ({
      ...prev,
      customItems: prev.customItems.filter(i => i !== item)
    }))
  }

  const handleSubmit = async () => {
    // Validate form
    if (!formData.name.trim()) {
      alert('Please enter an altar name')
      return
    }
    
    if (!formData.purpose.trim() && !formData.customPurpose.trim()) {
      alert('Please select or enter a purpose')
      return
    }

    try {
      // Combine purpose and customPurpose
      const purpose = formData.purpose || formData.customPurpose
      
      // Create the altar practice in Supabase
      const newAltar = await AltarPracticeService.createAltarPractice({
        name: formData.name,
        type: formData.type,
        purpose: purpose,
        practices: formData.practices,
        sacrifices: formData.sacrifices,
        custom_items: formData.customItems
      })

      // Update local state
      setAltars(prev => [newAltar, ...prev])
      
      setShowSuccess(true)
      setTimeout(() => {
        setShowSuccess(false)
        setView('list')
        resetForm()
      }, 2000)
    } catch (error) {
      console.error('Error creating altar practice:', error)
      alert('Failed to create altar practice. Please try again.')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'prayer',
      purpose: '',
      customPurpose: '',
      practices: [],
      sacrifices: [],
      customItems: []
    })
    setCurrentStep(1)
    setCustomItemInput('')
  }

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

  const getEntryCountBadgeColor = (count: number) => {
    if (count === 0) return 'bg-gray-100 text-gray-600'
    if (count <= 5) return 'bg-blue-100 text-blue-600'
    if (count <= 15) return 'bg-green-100 text-green-600'
    return 'bg-purple-100 text-purple-600'
  }

  if (view === 'create') {
    return (
      <section className="content-section active">
        <div className="form-container w-full max-w-3xl mx-auto">
          {showSuccess ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-4">
                <i className="fas fa-check text-green-600 text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Altar Created Successfully!</h3>
              <p className="text-gray-600">Your spiritual altar has been set up. May it be a place of encounter with the Divine.</p>
            </div>
          ) : (
            <>
              <div className="form-header p-6 text-white">
                <h2 className="text-2xl font-bold text-center">Create Your Sacred Altar</h2>
                <p className="text-center mt-2 opacity-90">Set up a dedicated space for your spiritual practices</p>
                
                {/* Progress Indicators */}
                <div className="flex justify-between items-center mt-6 mb-4">
                  {[1, 2, 3, 4].map((step) => (
                    <div key={step} className={`flex flex-col items-center ${currentStep >= step ? '' : 'opacity-50'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                        currentStep >= step ? 'bg-white text-purple-600' : 'bg-purple-400 text-white'
                      }`}>
                        {step}
                      </div>
                      <span className="text-xs mt-1">
                        {step === 1 ? 'Info' : step === 2 ? 'Practices' : step === 3 ? 'Sacrifices' : 'Custom'}
                      </span>
                    </div>
                  ))}
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-purple-400 rounded-full h-2">
                  <div 
                    className="bg-white h-2 rounded-full transition-all duration-300"
                    style={updateProgressIndicators(currentStep)}
                  ></div>
                </div>
              </div>

              <form className="p-6">
                {/* Step 1: Basic Information */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name of Altar</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="e.g., Morning Prayer Altar, Worship Sanctuary"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Type of Altar</label>
                      <select
                        value={formData.type}
                        onChange={(e) => handleInputChange('type', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        {Object.entries(altarTypes).map(([key, config]) => (
                          <option key={key} value={key}>{config.title}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Purpose/Focus</label>
                      <select
                        value={formData.purpose}
                        onChange={(e) => handleInputChange('purpose', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="">Select a purpose</option>
                        <option value="Daily communion with God">Daily communion with God</option>
                        <option value="Seeking guidance and wisdom">Seeking guidance and wisdom</option>
                        <option value="Intercession for others">Intercession for others</option>
                        <option value="Worship and praise">Worship and praise</option>
                        <option value="Repentance and restoration">Repentance and restoration</option>
                        <option value="Thanksgiving and gratitude">Thanksgiving and gratitude</option>
                        <option value="Spiritual breakthrough">Spiritual breakthrough</option>
                        <option value="custom">Custom purpose</option>
                      </select>
                    </div>

                    {formData.purpose === 'custom' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Custom Purpose</label>
                        <input
                          type="text"
                          value={formData.customPurpose}
                          onChange={(e) => handleInputChange('customPurpose', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="Describe your specific purpose"
                        />
                      </div>
                    )}

                    <div className="pt-6 flex justify-end">
                      <button
                        type="button"
                        onClick={handleNext}
                        className="btn-primary px-6 py-3 rounded-lg font-medium"
                      >
                        Next Step <i className="fas fa-arrow-right ml-2"></i>
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 2: Sacred Practices */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Select Sacred Practices</h3>
                    
                    <div className="space-y-4">
                      {practices.map((practice) => (
                        <div key={practice} className="checkbox-container pl-4 py-3 rounded-md">
                          <label className="flex items-center space-x-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.practices.includes(practice)}
                              onChange={() => handleCheckboxChange('practices', practice)}
                              className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                            />
                            <span className="text-gray-700">{practice}</span>
                          </label>
                        </div>
                      ))}
                    </div>

                    <div className="pt-6 flex justify-between">
                      <button
                        type="button"
                        onClick={handleBack}
                        className="btn-secondary px-6 py-3 rounded-lg font-medium"
                      >
                        <i className="fas fa-arrow-left mr-2"></i> Back
                      </button>
                      <button
                        type="button"
                        onClick={handleNext}
                        className="btn-primary px-6 py-3 rounded-lg font-medium"
                      >
                        Next Step <i className="fas fa-arrow-right ml-2"></i>
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3: Sacrifices */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Select Sacrifices</h3>
                    
                    <div className="space-y-4">
                      {sacrifices.map((sacrifice) => (
                        <div key={sacrifice} className="checkbox-container pl-4 py-3 rounded-md">
                          <label className="flex items-center space-x-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.sacrifices.includes(sacrifice)}
                              onChange={() => handleCheckboxChange('sacrifices', sacrifice)}
                              className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                            />
                            <span className="text-gray-700">{sacrifice}</span>
                          </label>
                        </div>
                      ))}
                    </div>

                    <div className="pt-6 flex justify-between">
                      <button
                        type="button"
                        onClick={handleBack}
                        className="btn-secondary px-6 py-3 rounded-lg font-medium"
                      >
                        <i className="fas fa-arrow-left mr-2"></i> Back
                      </button>
                      <button
                        type="button"
                        onClick={handleNext}
                        className="btn-primary px-6 py-3 rounded-lg font-medium"
                      >
                        Next Step <i className="fas fa-arrow-right ml-2"></i>
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 4: Custom Items */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Add Custom Items</h3>
                    <p className="text-gray-600 mb-4">Add any additional items, practices, or notes specific to your altar.</p>
                    
                    <div className="space-y-4">
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={customItemInput}
                          onChange={(e) => setCustomItemInput(e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="Enter custom item, practice, or note"
                          onKeyPress={(e) => e.key === 'Enter' && addCustomItem()}
                        />
                        <button
                          type="button"
                          onClick={addCustomItem}
                          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                        >
                          <i className="fas fa-plus"></i>
                        </button>
                      </div>

                      {formData.customItems.length > 0 && (
                        <div className="space-y-2">
                          {formData.customItems.map((item, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                              <span className="text-gray-700">{item}</span>
                              <button
                                type="button"
                                onClick={() => removeCustomItem(item)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <i className="fas fa-times"></i>
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="pt-6 flex justify-between">
                      <button
                        type="button"
                        onClick={handleBack}
                        className="btn-secondary px-6 py-3 rounded-lg font-medium"
                      >
                        <i className="fas fa-arrow-left mr-2"></i> Back
                      </button>
                      <button
                        type="button"
                        onClick={handleSubmit}
                        className="btn-primary px-6 py-3 rounded-lg font-medium"
                      >
                        <i className="fas fa-check mr-2"></i> Create Altar
                      </button>
                    </div>
                  </div>
                )}
              </form>
            </>
          )}
        </div>
      </section>
    )
  }

  // Default list view
  return (
    <section className="content-section active">
      <div className="mb-6">
        <button
          onClick={() => setView('create')}
          className="btn-primary px-6 py-3 rounded-lg font-medium"
        >
          <i className="fas fa-plus mr-2"></i>
          Create New Altar
        </button>
      </div>

      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {!loading && !error && (
        <>
          {altars.length === 0 ? (
            <div className="text-center py-12">
              <i className="fas fa-praying-hands text-gray-300 text-6xl mb-4"></i>
              <h3 className="text-2xl font-semibold text-gray-700 mb-2">No Altars Created Yet</h3>
              <p className="text-gray-500 mb-6">Create your first spiritual altar to begin your journey of faith and devotion.</p>
              <button
                onClick={() => setView('create')}
                className="btn-primary px-6 py-3 rounded-lg font-medium"
              >
                <i className="fas fa-plus mr-2"></i>
                Create Your First Altar
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {altars.map((altar) => {
                const config = altarTypes[altar.type as keyof typeof altarTypes]
                return (
                  <div key={altar.id} className="dashboard-card">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-full bg-white flex items-center justify-center ${config.color}`}>
                          <i className={`${config.icon} text-lg`}></i>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">{altar.name}</h3>
                          <p className="text-sm text-gray-500">{config.title}</p>
                        </div>
                      </div>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getEntryCountBadgeColor(0)}`}>
                        0 entries
                      </span>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4">{altar.purpose}</p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>Created {formatRelativeTime(altar.created_at)}</span>
                      <button className="text-purple-600 hover:text-purple-700 font-medium">
                        View Details →
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}
    </section>
  )
}
