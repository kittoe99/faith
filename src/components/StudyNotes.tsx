'use client'

import { useEffect, useState } from 'react'
import { StudyNotesService, StudyNote } from '../../lib/study-notes-service'

export default function StudyNotes() {
  const [notes, setNotes] = useState<StudyNote[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [editingId, setEditingId] = useState<string | null>(null)
  const [reference, setReference] = useState('')
  const [content, setContent] = useState('')

  useEffect(() => {
    refresh()
  }, [])

  async function refresh() {
    try {
      setLoading(true)
      const all = await StudyNotesService.list()
      setNotes(all)
    } catch (err) {
      console.error(err)
      setError('Failed to load notes')
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    try {
      if (editingId) {
        await StudyNotesService.update(editingId, content)
      } else {
        await StudyNotesService.create(reference, content)
      }
      setReference('')
      setContent('')
      setEditingId(null)
      await refresh()
    } catch (err) {
      alert('Error saving note')
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this note?')) return
    await StudyNotesService.delete(id)
    await refresh()
  }

  function startEdit(note: StudyNote) {
    setEditingId(note.id)
    setReference(note.reference)
    setContent(note.content)
  }

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Study Notes</h3>

      {/* Editor */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <div className="mb-3">
          <input
            type="text"
            placeholder="Reference (e.g. John 3:16)"
            className="w-full border px-3 py-2 rounded"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <textarea
            placeholder="Write your note..."
            className="w-full border px-3 py-2 rounded h-32"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <div className="flex gap-3 justify-end">
          {editingId && (
            <button
              className="px-4 py-2 bg-gray-200 rounded"
              onClick={() => {
                setEditingId(null)
                setReference('')
                setContent('')
              }}
            >
              Cancel
            </button>
          )}
          <button
            className="px-4 py-2 bg-amber-500 text-white rounded"
            onClick={handleSave}
          >
            {editingId ? 'Update Note' : 'Add Note'}
          </button>
        </div>
      </div>

      {/* Notes list */}
      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : error ? (
        <div className="text-red-600 py-4 text-center">{error}</div>
      ) : notes.length === 0 ? (
        <div className="text-center text-gray-500 py-8">No notes yet.</div>
      ) : (
        <ul className="space-y-4">
          {notes.map((n) => (
            <li key={n.id} className="border rounded-lg p-4 hover:shadow">
              <div className="flex justify-between items-start mb-2">
                <span className="font-medium text-amber-600">{n.reference}</span>
                <div className="space-x-2 text-sm">
                  <button
                    className="text-blue-600 hover:underline"
                    onClick={() => startEdit(n)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-600 hover:underline"
                    onClick={() => handleDelete(n.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
              <p className="whitespace-pre-wrap text-gray-700 text-sm">{n.content}</p>
              <p className="text-xs text-gray-400 mt-2">
                Updated {new Date(n.updated_at).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
