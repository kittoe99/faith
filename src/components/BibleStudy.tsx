'use client'

import { useState, useEffect } from 'react'
import { getBibleBooks, getBibleChapter } from '../../lib/bible-service'
import { BibleBook, BibleVerse } from '../../types/bible.types'

export default function BibleStudy() {
  const [books, setBooks] = useState<BibleBook[]>([])
  const [chapters, setChapters] = useState<BibleVerse[]>([])
  const [selectedBook, setSelectedBook] = useState<BibleBook | null>(null)
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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

  return (
    <section className="content-section active">
      <div className="max-w-6xl mx-auto">
        <div className="text-center py-8">
          <i className="fas fa-book-bible text-gray-300 text-6xl mb-4"></i>
          <h3 className="text-2xl font-semibold text-gray-700 mb-2">Bible Study</h3>
          <p className="text-gray-500 mb-6">
            Read and study God's Word with our integrated Bible tool.
          </p>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            {/* Book Selection */}
            <div className="w-full md:w-1/3 bg-white rounded-lg shadow p-4">
              <h4 className="text-lg font-semibold mb-3">Select Book</h4>
              {loading && books.length === 0 ? (
                <p>Loading books...</p>
              ) : (
                <div className="grid grid-cols-2 gap-2 max-h-96 overflow-y-auto">
                  {books.map((book) => (
                    <button
                      key={book.bookid}
                      className={`p-2 text-left rounded ${selectedBook?.bookid === book.bookid ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}
                      onClick={() => {
                        setSelectedBook(book);
                        setSelectedChapter(null);
                        setChapters([]);
                      }}
                    >
                      {book.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Chapter Selection */}
            <div className="w-full md:w-1/3 bg-white rounded-lg shadow p-4">
              <h4 className="text-lg font-semibold mb-3">Select Chapter</h4>
              {selectedBook ? (
                <div className="grid grid-cols-5 gap-2 max-h-96 overflow-y-auto">
                  {Array.from({ length: selectedBook?.chapters || 0 }, (_, i) => i + 1).map((chapter) => (
                    <button
                      key={chapter}
                      className={`p-2 text-center rounded ${selectedChapter === chapter ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}
                      onClick={() => selectedBook && fetchChapter(selectedBook, chapter)}
                    >
                      {chapter}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">Select a book first</p>
              )}
            </div>
            
            {/* Verse Display */}
            <div className="w-full md:w-1/3 bg-white rounded-lg shadow p-4">
              <h4 className="text-lg font-semibold mb-3">Study Tools</h4>
              <div className="space-y-3">
                <button className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                  <i className="fas fa-sticky-note mr-2"></i>Take Notes
                </button>
                <button className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors">
                  <i className="fas fa-bookmark mr-2"></i>Bookmark Verse
                </button>
                <button className="w-full p-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors">
                  <i className="fas fa-lightbulb mr-2"></i>Record Insight
                </button>
              </div>
            </div>
          </div>
          
          {/* Bible Chapter Display */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-xl font-semibold">
                {selectedBook?.name}{' '}
                {selectedChapter && `Chapter ${selectedChapter}`}
              </h4>
              {selectedBook && selectedChapter && (
                <button 
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  onClick={() => selectedBook && fetchChapter(selectedBook, selectedChapter)}
                >
                  <i className="fas fa-sync-alt mr-2"></i>Refresh
                </button>
              )}
            </div>
            
            {loading && (selectedBook || chapters.length > 0) ? (
              <div className="text-center py-8">
                <p>Loading chapter...</p>
              </div>
            ) : chapters.length > 0 ? (
              <div className="text-left">
                {chapters.map((verse) => (
                  <div key={verse.verse} className="mb-2 flex">
                    <span className="font-bold text-blue-600 mr-2 w-8 flex-shrink-0">{verse.verse}</span>
                    <span>{verse.text}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <i className="fas fa-book-open text-4xl mb-3"></i>
                <p>Select a book and chapter to read Scripture</p>
              </div>
            )}
          </div>
          
          {/* Study Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="dashboard-card text-center">
              <i className="fas fa-book-open text-blue-500 text-3xl mb-3"></i>
              <h4 className="text-lg font-semibold mb-2">Daily Reading Plan</h4>
              <p className="text-gray-600 text-sm">Follow a structured plan to read through the Bible</p>
              <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                Start Plan
              </button>
            </div>
            
            <div className="dashboard-card text-center">
              <i className="fas fa-sticky-note text-green-500 text-3xl mb-3"></i>
              <h4 className="text-lg font-semibold mb-2">Study Notes</h4>
              <p className="text-gray-600 text-sm">Take detailed notes on scriptures and insights</p>
              <button className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                Add Notes
              </button>
            </div>
            
            <div className="dashboard-card text-center">
              <i className="fas fa-lightbulb text-yellow-500 text-3xl mb-3"></i>
              <h4 className="text-lg font-semibold mb-2">Revelations</h4>
              <p className="text-gray-600 text-sm">Record spiritual insights and revelations</p>
              <button className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors">
                Add Insight
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
