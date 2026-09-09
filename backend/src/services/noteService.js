const { Note } = require('../models');
const ApiError = require('../utils/ApiError');

const getNotesForUser = async (userId) => {
  return Note.findAll({
    where: { userId },
    order: [['updatedAt', 'DESC']],
  });
};

const getNoteById = async (noteId, userId) => {
  const note = await Note.findOne({ where: { id: noteId, userId } });
  if (!note) {
    throw new ApiError(404, 'Note not found');
  }
  return note;
};

const createNote = async ({ title, content, userId }) => {
  return Note.create({ title, content, userId });
};

const updateNote = async (noteId, userId, { title, content }) => {
  const note = await getNoteById(noteId, userId);
  note.title = title ?? note.title;
  note.content = content ?? note.content;
  await note.save();
  return note;
};

const deleteNote = async (noteId, userId) => {
  const note = await getNoteById(noteId, userId);
  await note.destroy();
  return note;
};

module.exports = {
  getNotesForUser,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
};
