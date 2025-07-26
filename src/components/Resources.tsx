'use client'

export default function Resources() {
  const resourceCategories = [
    {
      title: 'Prayer Resources',
      icon: 'fas fa-praying-hands',
      color: 'text-purple-500',
      resources: [
        { name: 'Prayer Guide for Beginners', type: 'Guide', description: 'Learn the fundamentals of prayer' },
        { name: 'Daily Prayer Templates', type: 'Template', description: 'Structured prayers for daily use' },
        { name: 'Intercessory Prayer Lists', type: 'List', description: 'Systematic approach to praying for others' },
      ]
    },
    {
      title: 'Bible Study Tools',
      icon: 'fas fa-book-bible',
      color: 'text-blue-500',
      resources: [
        { name: 'Study Methods Guide', type: 'Guide', description: 'Different approaches to studying Scripture' },
        { name: 'Reading Plans', type: 'Plan', description: 'Structured Bible reading schedules' },
        { name: 'Scripture Memory Verses', type: 'List', description: 'Key verses for memorization' },
      ]
    },
    {
      title: 'Worship & Music',
      icon: 'fas fa-music',
      color: 'text-green-500',
      resources: [
        { name: 'Worship Playlist', type: 'Playlist', description: 'Curated songs for personal worship' },
        { name: 'Hymn Collection', type: 'Collection', description: 'Traditional hymns with lyrics' },
        { name: 'Psalms for Singing', type: 'Collection', description: 'Psalms set to music' },
      ]
    },
    {
      title: 'Spiritual Growth',
      icon: 'fas fa-seedling',
      color: 'text-orange-500',
      resources: [
        { name: 'Spiritual Disciplines Guide', type: 'Guide', description: 'Practices for spiritual formation' },
        { name: 'Christian Life Milestones', type: 'Tracker', description: 'Track your spiritual journey' },
        { name: 'Recommended Reading', type: 'List', description: 'Books for spiritual growth' },
      ]
    },
    {
      title: 'Community & Service',
      icon: 'fas fa-hands-helping',
      color: 'text-pink-500',
      resources: [
        { name: 'Service Opportunities', type: 'Directory', description: 'Ways to serve your community' },
        { name: 'Fellowship Ideas', type: 'Guide', description: 'Building Christian community' },
        { name: 'Evangelism Resources', type: 'Toolkit', description: 'Sharing your faith effectively' },
      ]
    },
    {
      title: 'Meditation & Reflection',
      icon: 'fas fa-om',
      color: 'text-teal-500',
      resources: [
        { name: 'Christian Meditation Guide', type: 'Guide', description: 'Biblical approach to meditation' },
        { name: 'Reflection Prompts', type: 'Prompts', description: 'Questions for deep reflection' },
        { name: 'Contemplative Practices', type: 'Guide', description: 'Ancient practices for modern believers' },
      ]
    }
  ]

  const getTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      'Guide': 'bg-blue-100 text-blue-800',
      'Template': 'bg-green-100 text-green-800',
      'List': 'bg-purple-100 text-purple-800',
      'Plan': 'bg-orange-100 text-orange-800',
      'Playlist': 'bg-pink-100 text-pink-800',
      'Collection': 'bg-indigo-100 text-indigo-800',
      'Tracker': 'bg-yellow-100 text-yellow-800',
      'Directory': 'bg-red-100 text-red-800',
      'Toolkit': 'bg-gray-100 text-gray-800',
      'Prompts': 'bg-cyan-100 text-cyan-800'
    }
    return colors[type] || 'bg-gray-100 text-gray-800'
  }

  return (
    <section className="content-section active">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Spiritual Resources</h2>
          <p className="text-lg text-gray-600">
            Tools, guides, and materials to support your Christian walk and spiritual growth
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {resourceCategories.map((category, index) => (
            <div key={index} className="dashboard-card">
              <div className="flex items-center space-x-3 mb-4">
                <div className={`w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center ${category.color}`}>
                  <i className={`${category.icon} text-lg`}></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-800">{category.title}</h3>
              </div>
              
              <div className="space-y-3">
                {category.resources.map((resource, resourceIndex) => (
                  <div key={resourceIndex} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-800 text-sm">{resource.name}</h4>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(resource.type)}`}>
                        {resource.type}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">{resource.description}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <button className="w-full text-sm text-purple-600 hover:text-purple-700 font-medium">
                  View All Resources →
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Access Section */}
        <div className="mt-12 dashboard-card">
          <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">Quick Access</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="p-4 text-center hover:bg-gray-50 rounded-lg transition-colors">
              <i className="fas fa-download text-blue-500 text-2xl mb-2"></i>
              <div className="text-sm font-medium text-gray-800">Downloads</div>
              <div className="text-xs text-gray-500">PDF resources</div>
            </button>
            
            <button className="p-4 text-center hover:bg-gray-50 rounded-lg transition-colors">
              <i className="fas fa-bookmark text-green-500 text-2xl mb-2"></i>
              <div className="text-sm font-medium text-gray-800">Bookmarks</div>
              <div className="text-xs text-gray-500">Saved resources</div>
            </button>
            
            <button className="p-4 text-center hover:bg-gray-50 rounded-lg transition-colors">
              <i className="fas fa-share-alt text-purple-500 text-2xl mb-2"></i>
              <div className="text-sm font-medium text-gray-800">Share</div>
              <div className="text-xs text-gray-500">Send to others</div>
            </button>
            
            <button className="p-4 text-center hover:bg-gray-50 rounded-lg transition-colors">
              <i className="fas fa-plus text-orange-500 text-2xl mb-2"></i>
              <div className="text-sm font-medium text-gray-800">Suggest</div>
              <div className="text-xs text-gray-500">Add resource</div>
            </button>
          </div>
        </div>

        {/* Coming Soon Notice */}
        <div className="mt-8 p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
          <div className="text-center">
            <i className="fas fa-rocket text-purple-500 text-3xl mb-3"></i>
            <h4 className="text-lg font-semibold text-purple-800 mb-2">More Resources Coming Soon</h4>
            <p className="text-purple-600">
              We're constantly adding new resources to help you grow in your faith. 
              Interactive tools, downloadable content, and community-contributed resources will be available in future updates.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
