import React from 'react';

const stripHtml = (html = '') => html.replace(/<[^>]*>?/gm, '');

export default function NoteCard({ note, onEdit, onDelete }) {
  const preview = stripHtml(note.content).slice(0, 140);

  return (
    <div className="note-card" data-testid="note-card">
      <h3 className="note-card-title">{note.title}</h3>
      <p className="note-card-preview">{preview || 'No content yet...'}</p>
      <div className="note-card-footer">
        <span className="note-card-date">
          {new Date(note.updatedAt || note.createdAt).toLocaleDateString()}
        </span>
        <div className="note-card-actions">
          <button className="btn-secondary" onClick={() => onEdit(note)}>
            Edit
          </button>
          <button className="btn-danger" onClick={() => onDelete(note.id)}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
