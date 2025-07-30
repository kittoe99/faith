'use client'

import Modal from './ui/Modal'
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
  
  // Modal states
  const [showBooksModal, setShowBooksModal] = useState(false)
  const [showChapterModal, setShowChapterModal] = useState(false)
  const [showChapterListModal, setShowChapterListModal] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set())

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
      setShowChapterModal(true)
      setShowBooksModal(false)
      setShowChapterListModal(false)
    } catch (err) {
      setError('Failed to load Bible chapter')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const toggleBookmark = (verseKey: string) => {
    const newBookmarks = new Set(bookmarks)
    if (newBookmarks.has(verseKey)) {
      newBookmarks.delete(verseKey)
    } else {
      newBookmarks.add(verseKey)
    }
    setBookmarks(newBookmarks)
  }

  const openChapterList = (book: BibleBook) => {
    setSelectedBook(book)
    setShowBooksModal(false)
    setShowChapterListModal(true)
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
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Holy Bible</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Read and study God's Word with our comprehensive Bible reader
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <div className="flex items-center">
              <i className="fas fa-exclamation-triangle mr-2"></i>
              {error}
            </div>
          </div>
        )}

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div 
            onClick={() => setShowBooksModal(true)}
            className="bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center mr-4">
                <i className="fas fa-book text-white text-xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Browse Books</h3>
            </div>
            <p className="text-gray-600">Explore all 66 books of the Bible</p>
          </div>

          {selectedBook && (
            <div 
              onClick={() => openChapterList(selectedBook)}
              className="bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center mr-4">
                  <i className="fas fa-list text-white text-xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-800">Chapters</h3>
              </div>
              <p className="text-gray-600">Browse {selectedBook.name} chapters</p>
            </div>
          )}

          <div 
            onClick={() => setShowSettingsModal(true)}
            className="bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center mr-4">
                <i className="fas fa-cog text-white text-xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Settings</h3>
            </div>
            <p className="text-gray-600">Customize your reading experience</p>
          </div>
        </div>

        {/* Current Reading Display */}
        {selectedBook && selectedChapter && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-semibold text-gray-800">
                Currently Reading: {selectedBook.name} {selectedChapter}
              </h3>
              <button
                onClick={() => setShowChapterModal(true)}
                className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
              >
                Continue Reading
              </button>
            </div>
          </div>
        )}

        {/* Books Modal */}
        {showBooksModal && (
          <Modal 
            open={true} 
            onClose={() => setShowBooksModal(false)} 
            title="Select a Book"
            widthClass="max-w-4xl"
          >
            <div className="mb-6">
              {/* Search */}
              <div className="relative mb-4">
                <input
                  type="text"
                  placeholder="Search books..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
                <i className="fas fa-search absolute left-3 top-4 text-gray-400"></i>
              </div>

              {/* Testament Filters */}
              <div className="flex gap-3 mb-6">
                <button
                  onClick={() => setShowOldTestament(!showOldTestament)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    showOldTestament 
                      ? 'bg-amber-500 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Old Testament
                </button>
                <button
                  onClick={() => setShowNewTestament(!showNewTestament)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    showNewTestament 
                      ? 'bg-amber-500 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  New Testament
                </button>
              </div>
            </div>

            {/* Old Testament Books */}
            {showOldTestament && oldTestamentBooks.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <i className="fas fa-scroll mr-2 text-amber-500"></i>
                  Old Testament
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {oldTestamentBooks.map((book) => (
                    <button
                      key={book.bookid}
                      onClick={() => openChapterList(book)}
                      className="p-3 text-left bg-gray-50 hover:bg-amber-50 hover:border-amber-200 border border-gray-200 rounded-lg transition-all duration-200 hover:shadow-md"
                    >
                      <div className="font-medium text-gray-800">{book.name}</div>
                      <div className="text-sm text-gray-500">{book.chapters} chapters</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* New Testament Books */}
            {showNewTestament && newTestamentBooks.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <i className="fas fa-cross mr-2 text-amber-500"></i>
                  New Testament
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {newTestamentBooks.map((book) => (
                    <button
                      key={book.bookid}
                      onClick={() => openChapterList(book)}
                      className="p-3 text-left bg-gray-50 hover:bg-amber-50 hover:border-amber-200 border border-gray-200 rounded-lg transition-all duration-200 hover:shadow-md"
                    >
                      <div className="font-medium text-gray-800">{book.name}</div>
                      <div className="text-sm text-gray-500">{book.chapters} chapters</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </Modal>
        )}

        {/* Chapter List Modal */}
        {showChapterListModal && selectedBook && (
          <Modal 
            open={true} 
            onClose={() => setShowChapterListModal(false)} 
            title={`${selectedBook.name} - Select Chapter`}
            widthClass="max-w-2xl"
          >
            <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
              {Array.from({ length: selectedBook.chapters }, (_, i) => i + 1).map((chapterNum) => (
                <button
                  key={chapterNum}
                  onClick={() => fetchChapter(selectedBook, chapterNum)}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 hover:shadow-md ${
                    selectedChapter === chapterNum
                      ? 'bg-amber-500 text-white border-amber-500'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-amber-300 hover:bg-amber-50'
                  }`}
                >
                  <div className="text-center font-semibold">{chapterNum}</div>
                </button>
              ))}
            </div>
          </Modal>
        )}

        {/* Settings Modal */}
        {showSettingsModal && (
          <Modal 
            open={true} 
            onClose={() => setShowSettingsModal(false)} 
            title="Reading Settings"
            widthClass="max-w-md"
          >
            <div className="space-y-6">
              {/* Font Size */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Font Size</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'text-sm', label: 'Small' },
                    { value: 'text-base', label: 'Medium' },
                    { value: 'text-lg', label: 'Large' }
                  ].map((size) => (
                    <button
                      key={size.value}
                      onClick={() => setFontSize(size.value)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        fontSize === size.value
                          ? 'bg-amber-500 text-white border-amber-500'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-amber-300'
                      }`}
                    >
                      {size.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Testament Display */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Testament Display</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={showOldTestament}
                      onChange={(e) => setShowOldTestament(e.target.checked)}
                      className="rounded text-amber-500 focus:ring-amber-500"
                    />
                    <span className="ml-2 text-gray-700">Show Old Testament</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={showNewTestament}
                      onChange={(e) => setShowNewTestament(e.target.checked)}
                      className="rounded text-amber-500 focus:ring-amber-500"
                    />
                    <span className="ml-2 text-gray-700">Show New Testament</span>
                  </label>
                </div>
              </div>
            </div>
          </Modal>
        )}

        {/* Enhanced Chapter Reading Modal */}
        {showChapterModal && selectedBook && selectedChapter && (
          <Modal 
            open={true} 
            onClose={() => setShowChapterModal(false)} 
            title={
              <div className="flex items-center justify-between w-full">
                <span>{selectedBook.name} {selectedChapter}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={goToPreviousChapter}
                    disabled={selectedBook.bookid === 1 && selectedChapter === 1}
                    className="p-2 text-gray-600 hover:text-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title="Previous Chapter"
                  >
                    <i className="fas fa-chevron-left"></i>
                  </button>
                  <button
                    onClick={goToNextChapter}
                    disabled={selectedBook.bookid === books[books.length - 1]?.bookid && selectedChapter === selectedBook.chapters}
                    className="p-2 text-gray-600 hover:text-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title="Next Chapter"
                  >
                    <i className="fas fa-chevron-right"></i>
                  </button>
                </div>
              </div>
            }
            widthClass="max-w-4xl"
          >
            {loading ? (
              <div className="text-center py-12">
                <i className="fas fa-spinner fa-spin text-amber-500 text-2xl mb-4"></i>
                <p className="text-gray-500">Loading chapter...</p>
              </div>
            ) : chapters.length > 0 ? (
              <div>
                <div className={`space-y-4 ${fontSize} leading-relaxed mb-6`}>
                  {chapters.map((verse) => {
                    const verseKey = `${selectedBook.name}-${selectedChapter}-${verse.verse}`
                    const isBookmarked = bookmarks.has(verseKey)
                    
                    return (
                      <div key={verse.verse} className="flex group hover:bg-amber-50 p-3 rounded-lg transition-colors">
                        <span className="font-bold text-amber-600 mr-4 w-8 flex-shrink-0 text-sm">
                          {verse.verse}
                        </span>
                        <span className="text-gray-800 flex-1">{verse.text}</span>
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
                  })}
                </div>

                {/* Chapter Navigation Footer */}
                <div className="bg-gray-50 px-6 py-4 flex justify-between items-center rounded-lg">
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
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <i className="fas fa-book-open text-4xl mb-4"></i>
                <p>No verses found for this chapter</p>
              </div>
            )}
          </Modal>
        )}
      </div>
    </section>
  )
}
