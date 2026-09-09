import React, { useEffect, useState } from 'react';
import NoteCard from '../components/NoteCard';
import NoteEditor from '../components/NoteEditor';
import Loader from '../components/Loader';
import { notesApi } from '../services/api';

export default function Dashboard() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingNote, setEditingNote] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchNotes = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await notesApi.getAll();
      setNotes(data.data.notes);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleCreateNew = () => {
    setEditingNote(null);
    setIsCreating(true);
  };

  const handleEdit = (note) => {
    setEditingNote(note);
    setIsCreating(true);
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingNote(null);
  };

  const handleSave = async ({ title, content }) => {
    setSaving(true);
    setError('');
    try {
      if (editingNote) {
        await notesApi.update(editingNote.id, { title, content });
      } else {
        await notesApi.create({ title, content });
      }
      await fetchNotes();
      setIsCreating(false);
      setEditingNote(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this note? This cannot be undone.')) return;
    try {
      await notesApi.remove(id);
      setNotes((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <Loader label="Loading your notes..." />;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>My Notes</h1>
        {!isCreating && (
          <button className="btn-primary" onClick={handleCreateNew}>
            + New Note
          </button>
        )}
      </div>

      {error && <p className="form-error">{error}</p>}

      {isCreating ? (
        <NoteEditor
          initialNote={editingNote}
          onSave={handleSave}
          onCancel={handleCancel}
          saving={saving}
        />
      ) : notes.length === 0 ? (
        <p className="empty-state">You don't have any notes yet. Create your first one!</p>
      ) : (
        <div className="notes-grid">
          {notes.map((note) => (
            <NoteCard key={note.id} note={note} onEdit={handleEdit} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
