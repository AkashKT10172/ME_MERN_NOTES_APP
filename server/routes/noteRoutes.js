const express = require('express');
const {
  createNote,
  getNotes,
  updateNote,
  deleteNote,
  togglePinNote,
} = require('../controllers/noteController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, createNote); // Route to create a new note
router.get('/', protect, getNotes); // Route to get all notes for the logged-in user
router.put('/:noteId', protect, updateNote); // Route to update a note
router.delete('/:noteId', protect, deleteNote); // Route to delete a note
router.put('/:noteId/pin', protect, togglePinNote); // Route to pin or unpin a note

module.exports = router;
