const { validationResult } = require('express-validator');
const noteService = require('../services/noteService');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');

const getNotes = asyncHandler(async (req, res) => {
  const notes = await noteService.getNotesForUser(req.user.id);
  res.status(200).json({ success: true, data: { notes } });
});

const getNote = asyncHandler(async (req, res) => {
  const note = await noteService.getNoteById(req.params.id, req.user.id);
  res.status(200).json({ success: true, data: { note } });
});

const createNote = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ApiError(400, 'Validation failed', errors.array());
  }

  const { title, content } = req.body;
  const note = await noteService.createNote({ title, content, userId: req.user.id });

  logger.info({ noteId: note.id, userId: req.user.id }, 'Note created');
  res.status(201).json({ success: true, data: { note } });
});

const updateNote = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ApiError(400, 'Validation failed', errors.array());
  }

  const { title, content } = req.body;
  const note = await noteService.updateNote(req.params.id, req.user.id, { title, content });

  logger.info({ noteId: note.id, userId: req.user.id }, 'Note updated');
  res.status(200).json({ success: true, data: { note } });
});

const deleteNote = asyncHandler(async (req, res) => {
  const note = await noteService.deleteNote(req.params.id, req.user.id);
  logger.info({ noteId: note.id, userId: req.user.id }, 'Note deleted');
  res.status(200).json({ success: true, data: { message: 'Note deleted successfully' } });
});

module.exports = { getNotes, getNote, createNote, updateNote, deleteNote };
