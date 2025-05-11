const Note = require('../models/Note');

const createNote = async (req, res) => {
  const { title, content } = req.body;
  const userId = req.user; // From auth middleware

  try {
    const newNote = new Note({
      user: userId,
      title,
      content,
    });

    await newNote.save();
    res.status(201).json(newNote);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getNotes = async (req, res) => {
    const userId = req.user; // From auth middleware
    const { search } = req.query; // Search query parameter
  
    try {
      // Build the query object
      const query = { user: userId };
  
      if (search) {
        // Search by title or content (case insensitive)
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { content: { $regex: search, $options: 'i' } },
        ];
      }
  
      const notes = await Note.find(query).sort({ pinned: -1, createdAt: -1 });
      res.json(notes);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  

const updateNote = async (req, res) => {
  const { noteId } = req.params;
  const { title, content } = req.body;
  const userId = req.user;

  try {
    const note = await Note.findOne({ _id: noteId, user: userId });
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    note.title = title || note.title;
    note.content = content || note.content;

    await note.save();
    res.json(note);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteNote = async (req, res) => {
  const { noteId } = req.params;
  const userId = req.user;

  try {
    const note = await Note.findOneAndDelete({ _id: noteId, user: userId });
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const togglePinNote = async (req, res) => {
  const { noteId } = req.params;
  const userId = req.user;

  try {
    const note = await Note.findOne({ _id: noteId, user: userId });
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    note.pinned = !note.pinned; // Toggle pinned status
    await note.save();

    res.json(note);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createNote, getNotes, updateNote, deleteNote, togglePinNote };
