'use client'

import { useState, useEffect } from 'react'
import { getBibleBooks, getBibleChapter } from '../../lib/bible-service'
import { BibleBook, BibleVerse } from '../../types/bible.types'

export default function Bible() {
  const [books, setBooks] = useState<BibleBook[]>([])
  const [chapters, setChapters] = useState<BibleVerse[]>([])
  const [selectedBook, setSelectedBook] = useState<BibleBook | null>(null)
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [fontSize, setFontSize] = useState('text-base')
  const [showOldTestament, setShowOldTestament] = useState(true)
  const [showNewTestament, setShowNewTestament] = useState(true)

  useEffect(() => {
    fetchBooks()
  }, [])

  const fetchBooks = async () => {
    setLoading(true)
    try {
      const bibleBooks = await getBibleBooks()
      setBooks(bibleBooks)
    } catch (err) {
      setError('Failed to load Bible books')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchChapter = async (book: BibleBook, chapterId: number) => {
    setLoading(true)
    setError(null)
    try {
      const chapterVerses = await getBibleChapter(book.name, chapterId)
      setChapters(chapterVerses)
      setSelectedBook(book)
      setSelectedChapter(chapterId)
    } catch (err) {
      setError('Failed to load Bible chapter')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.name.toLowerCase().includes(searchTerm.toLowerCase())
    const isOldTestament = book.bookid <= 39
    const isNewTestament = book.bookid > 39
    
    if (!showOldTestament && isOldTestament) return false
    if (!showNewTestament && isNewTestament) return false
    
    return matchesSearch
  })

  const oldTestamentBooks = filteredBooks.filter(book => book.bookid <= 39)
  const newTestamentBooks = filteredBooks.filter(book => book.bookid > 39)

  const goToPreviousChapter = () => {
    if (!selectedBook || !selectedChapter) return
    
    if (selectedChapter > 1) {
      fetchChapter(selectedBook, selectedChapter - 1)
    } else {
      // Go to previous book's last chapter
      const currentBookIndex = books.findIndex(book => book.bookid === selectedBook.bookid)
      if (currentBookIndex > 0) {
        const previousBook = books[currentBookIndex - 1]
        fetchChapter(previousBook, previousBook.chapters)
      }
    }
  }

  const goToNextChapter = () => {
    if (!selectedBook || !selectedChapter) return
    
    if (selectedChapter < selectedBook.chapters) {
      fetchChapter(selectedBook, selectedChapter + 1)
    } else {
      // Go to next book's first chapter
      const currentBookIndex = books.findIndex(book => book.bookid === selectedBook.bookid)
      if (currentBookIndex < books.length - 1) {
        const nextBook = books[currentBookIndex + 1]
        fetchChapter(nextBook, 1)
      }
    }
  }

  return (
    <section className="content-section active">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full mb-4 shadow-lg">
            <i className="fas fa-book-bible text-white text-2xl"></i>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Holy Bible</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            "All Scripture is God-breathed and is useful for teaching, rebuking, correcting and training in righteousness." - 2 Timothy 3:16
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded-r-lg">
            <div className="flex">
              <i className="fas fa-exclamation-triangle text-red-400 mr-3 mt-1"></i>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Book Selection */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Books of the Bible</h3>
                
                {/* Search */}
                <div className="relative mb-4">
                  <input
                    type="text"
                    placeholder="Search books..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                  <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
                </div>

                {/* Testament Filters */}
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => setShowOldTestament(!showOldTestament)}
                    className={`px-3 py-1 text-xs rounded-full transition-colors ${
                      showOldTestament 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                  >
                    Old Testament
                  </button>
                  <button
                    onClick={() => setShowNewTestament(!showNewTestament)}
                    className={`px-3 py-1 text-xs rounded-full transition-colors ${
                      showNewTestament 
                        ? 'bg-purple-500 text-white' 
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                  >
                    New Testament
                  </button>
                </div>
              </div>

              {loading && books.length === 0 ? (
                <div className="text-center py-4">
                  <i className="fas fa-spinner fa-spin text-gray-400 text-xl mb-2"></i>
                  <p className="text-gray-500">Loading books...</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {/* Old Testament */}
                  {showOldTestament && oldTestamentBooks.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-blue-600 mb-2 uppercase tracking-wide">Old Testament</h4>
                      <div className="space-y-1">
                        {oldTestamentBooks.map((book) => (
                          <button
                            key={book.bookid}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                              selectedBook?.bookid === book.bookid 
                                ? 'bg-blue-500 text-white shadow-md' 
                                : 'hover:bg-blue-50 text-gray-700'
                            }`}
                            onClick={() => {
                              setSelectedBook(book)
                              setSelectedChapter(null)
                              setChapters([])
                            }}
                          >
                            {book.name}
                            <span className="text-xs opacity-75 ml-1">({book.chapters})</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* New Testament */}
                  {showNewTestament && newTestamentBooks.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-purple-600 mb-2 uppercase tracking-wide">New Testament</h4>
                      <div className="space-y-1">
                        {newTestamentBooks.map((book) => (
                          <button
                            key={book.bookid}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                              selectedBook?.bookid === book.bookid 
                                ? 'bg-purple-500 text-white shadow-md' 
                                : 'hover:bg-purple-50 text-gray-700'
                            }`}
                            onClick={() => {
                              setSelectedBook(book)
                              setSelectedChapter(null)
                              setChapters([])
                            }}
                          >
                            {book.name}
                            <span className="text-xs opacity-75 ml-1">({book.chapters})</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {selectedBook ? (
              <div className="space-y-6">
                {/* Chapter Selection */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2 sm:mb-0">
                      {selectedBook.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">Font size:</span>
                      <select
                        value={fontSize}
                        onChange={(e) => setFontSize(e.target.value)}
                        className="text-sm border border-gray-300 rounded px-2 py-1"
                      >
                        <option value="text-sm">Small</option>
                        <option value="text-base">Medium</option>
                        <option value="text-lg">Large</option>
                        <option value="text-xl">Extra Large</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
                    {Array.from({ length: selectedBook.chapters }, (_, i) => i + 1).map((chapter) => (
                      <button
                        key={chapter}
                        className={`p-2 text-center rounded-lg text-sm font-medium transition-colors ${
                          selectedChapter === chapter 
                            ? 'bg-amber-500 text-white shadow-md' 
                            : 'bg-gray-100 hover:bg-amber-100 text-gray-700'
                        }`}
                        onClick={() => fetchChapter(selectedBook, chapter)}
                      >
                        {chapter}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Chapter Content */}
                {selectedChapter && (
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    {/* Chapter Header */}
                    <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-2xl font-bold">{selectedBook.name} {selectedChapter}</h2>
                          <p className="text-amber-100 mt-1">Chapter {selectedChapter} of {selectedBook.chapters}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={goToPreviousChapter}
                            disabled={selectedBook.bookid === 1 && selectedChapter === 1}
                            className="p-2 rounded-lg bg-white/20 hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <i className="fas fa-chevron-left"></i>
                          </button>
                          <button
                            onClick={goToNextChapter}
                            disabled={selectedBook.bookid === books[books.length - 1]?.bookid && selectedChapter === selectedBook.chapters}
                            className="p-2 rounded-lg bg-white/20 hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <i className="fas fa-chevron-right"></i>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Chapter Verses */}
                    <div className="p-6">
                      {loading ? (
                        <div className="text-center py-12">
                          <i className="fas fa-spinner fa-spin text-amber-500 text-2xl mb-4"></i>
                          <p className="text-gray-500">Loading chapter...</p>
                        </div>
                      ) : chapters.length > 0 ? (
                        <div className={`space-y-4 ${fontSize} leading-relaxed`}>
                          {chapters.map((verse) => (
                            <div key={verse.verse} className="flex group hover:bg-amber-50 p-2 rounded-lg transition-colors">
                              <span className="font-bold text-amber-600 mr-4 w-8 flex-shrink-0 text-sm">
                                {verse.verse}
                              </span>
                              <span className="text-gray-800 flex-1">{verse.text}</span>
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                                <button className="text-gray-400 hover:text-amber-500 p-1">
                                  <i className="fas fa-bookmark text-xs"></i>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12 text-gray-500">
                          <i className="fas fa-book-open text-4xl mb-4"></i>
                          <p>No verses found for this chapter</p>
                        </div>
                      )}
                    </div>

                    {/* Chapter Navigation Footer */}
                    {selectedChapter && (
                      <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
                        <button
                          onClick={goToPreviousChapter}
                          disabled={selectedBook.bookid === 1 && selectedChapter === 1}
                          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <i className="fas fa-chevron-left"></i>
                          Previous Chapter
                        </button>
                        <span className="text-sm text-gray-500">
                          {selectedBook.name} {selectedChapter}:{chapters.length} verses
                        </span>
                        <button
                          onClick={goToNextChapter}
                          disabled={selectedBook.bookid === books[books.length - 1]?.bookid && selectedChapter === selectedBook.chapters}
                          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          Next Chapter
                          <i className="fas fa-chevron-right"></i>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="fas fa-book-bible text-white text-3xl"></i>
                </div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">Select a Book to Begin</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Choose a book from the sidebar to start reading God's Word. You can search for specific books or browse by testament.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
