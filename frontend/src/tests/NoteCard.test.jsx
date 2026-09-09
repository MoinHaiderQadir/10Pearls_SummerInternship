import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import NoteCard from '../components/NoteCard';

const sampleNote = {
  id: 1,
  title: 'Grocery List',
  content: '<p>Milk, eggs, bread</p>',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

describe('NoteCard', () => {
  it('renders the note title and a stripped-down content preview', () => {
    render(<NoteCard note={sampleNote} onEdit={() => {}} onDelete={() => {}} />);

    expect(screen.getByText('Grocery List')).toBeInTheDocument();
    expect(screen.getByText(/Milk, eggs, bread/)).toBeInTheDocument();
  });

  it('calls onEdit with the note when the Edit button is clicked', () => {
    const onEdit = jest.fn();
    render(<NoteCard note={sampleNote} onEdit={onEdit} onDelete={() => {}} />);

    fireEvent.click(screen.getByText('Edit'));
    expect(onEdit).toHaveBeenCalledWith(sampleNote);
  });

  it('calls onDelete with the note id when the Delete button is clicked', () => {
    const onDelete = jest.fn();
    render(<NoteCard note={sampleNote} onEdit={() => {}} onDelete={onDelete} />);

    fireEvent.click(screen.getByText('Delete'));
    expect(onDelete).toHaveBeenCalledWith(1);
  });

  it('shows a fallback message when content is empty', () => {
    render(<NoteCard note={{ ...sampleNote, content: '' }} onEdit={() => {}} onDelete={() => {}} />);
    expect(screen.getByText('No content yet...')).toBeInTheDocument();
  });
});
