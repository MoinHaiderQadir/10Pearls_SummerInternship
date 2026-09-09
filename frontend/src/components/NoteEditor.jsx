import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link', 'clean'],
  ],
};

export default function NoteEditor({ initialNote, onSave, onCancel, saving }) {
  const [title, setTitle] = useState(initialNote?.title || '');
  const [content, setContent] = useState(initialNote?.content || '');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    setError('');
    onSave({ title: title.trim(), content });
  };

  return (
    <form className="note-editor" onSubmit={handleSubmit}>
      <input
        type="text"
        className="note-editor-title"
        placeholder="Note title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        data-testid="note-title-input"
      />
      {error && <p className="form-error">{error}</p>}
      <ReactQuill
        theme="snow"
        value={content}
        onChange={setContent}
        modules={quillModules}
        placeholder="Write your note here..."
      />
      <div className="note-editor-actions">
        <button type="button" className="btn-secondary" onClick={onCancel} disabled={saving}>
          Cancel
        </button>
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? 'Saving...' : 'Save Note'}
        </button>
      </div>
    </form>
  );
}
