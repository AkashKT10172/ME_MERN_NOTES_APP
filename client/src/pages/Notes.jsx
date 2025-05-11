import React, { useState, useEffect } from "react";
import { Button, Form, Card, Alert, Spinner, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useNotes } from "../context/NotesContext";
import { createNote, deleteNote, togglePinNote, getNotes, updateNote } from "../services/notesService";
import { FaEdit, FaTrash, FaThumbtack } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";

const Notes = () => {
  const { notes, setNotes, loading, setLoading } = useNotes();
  const [newNote, setNewNote] = useState({ title: "", content: "" });
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [selectedNote, setSelectedNote] = useState(null); // For modal content
  const [showModal, setShowModal] = useState(false); // To show/hide modal
  const [editable, setEditable] = useState(false); // To toggle edit mode in modal
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [dummy, setDummy] = useState(false);
  const forceRender = () => setDummy(!dummy); 

  // Fetch notes from the backend (with search filter if any)
  const fetchNotes = async (searchQuery = "") => {
    setLoading(true);
    try {
      const response = await getNotes(searchQuery);
      setNotes(response.data);
    } catch (err) {
      setError("Failed to fetch notes.");
    } finally {
      setLoading(false);
    }
  };

  // Create a new note
  const handleCreateNote = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await createNote(newNote);
      setNotes((prev) => [res.data, ...prev]); // Add new note to the state
      setNewNote({ title: "", content: "" }); // Clear the form
    } catch (err) {
      setError("Failed to create note.");
    }
  };

  // Delete a note
  const handleDeleteNote = async (id) => {
    try {
      await deleteNote(id);
      setNotes((prev) => prev.filter((note) => note._id !== id)); // Remove from state
    } catch (err) {
      setError("Failed to delete note.");
    }
  };

  // Toggle pin/unpin a note
  const handlePinNote = async (id, pinned) => {
    try {
      const updatedNote = await togglePinNote(id); // Call the backend API to toggle the pin status

      // Re-sort notes immediately after updating the pin status
      setNotes((prev) => {
        const updatedNotes = prev.map((note) =>
          note._id === id ? { ...note, pinned: updatedNote.pinned } : note
        );

        // Sort pinned notes first, then the rest by date created (newest first)
        return updatedNotes.sort((a, b) => {
          if (a.pinned === b.pinned) {
            // If pinned status is the same, sort by createdAt
            return new Date(b.createdAt) - new Date(a.createdAt);
          }
          return a.pinned ? -1 : 1; // Pinned notes come first
        });
      });
    } catch (err) {
      setError("Failed to pin/unpin note.");
    }
  };

  // Search notes based on input
  const handleSearch = async (e) => {
    e.preventDefault();
    fetchNotes(search); // Fetch filtered notes
  };

  // Open modal to view/edit note
  const handleShowModal = (note) => {
    setSelectedNote(note);
    setEditable(false); // Initially set the note as non-editable
    setShowModal(true);
  };

  // Close modal
  const handleUpdateNote = async () => {
    try {
      // Send the updated note to the backend
      const updatedNote = await updateNote(selectedNote._id, selectedNote);
  
      // Update notes state immutably and trigger a re-render
      setNotes((prevNotes) => {
        // Create a new array with the updated note
        const updatedNotes = prevNotes.map((note) =>
          note._id === updatedNote._id ? updatedNote : note
        );
  
        // Sort notes by pinned status and date
        return updatedNotes.sort((a, b) => {
          if (a.pinned === b.pinned) {
            return new Date(b.createdAt) - new Date(a.createdAt);
          }
          return a.pinned ? -1 : 1; // Pinned notes come first
        });
      });
  
      // Close the modal only after the state is updated
      setShowModal(false);
      setSelectedNote({ title: "", content: "" }); // Clear selected note state
      setEditable(false); // Disable the edit mode
      fetchNotes();
    } catch (err) {
      console.error("Error updating note:", err);
      setError("Failed to update note.");
    }
  };
  
  
  const handleCloseModal = () => {
    setEditable(false); // Disable editing when closing the modal
    setSelectedNote({ title: "", content: "" }); // Reset the selected note
    setShowModal(false); // Close the modal
    forceRender();
  };
  

  // Handle change in the modal input
  const handleNoteChange = (e) => {
    const { name, value } = e.target;
    setSelectedNote((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Fetch notes on component mount
  useEffect(() => {
    fetchNotes();
  }, []);

  const inputClass = theme === "dark" ? "bg-dark text-light border-secondary" : "";

  return (
    <div>
      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSearch} className="mb-4 d-flex flex-column flex-sm-row gap-2 align-items-start">
        <Form.Control
          type="text"
          placeholder="Search notes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={inputClass}
        />
        <Button type="submit" variant="outline-info">
          Search
        </Button>
      </Form>

      <Card className="mb-4">
        <Card.Body>
          <h4>Create a New Note</h4>
          <Form onSubmit={handleCreateNote}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={newNote.title}
                onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                required
                className={inputClass}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                name="content"
                value={newNote.content}
                onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                required
                className={inputClass}
              />
            </Form.Group>
            <Button type="submit" disabled={loading}>
              {loading ? <Spinner size="sm" animation="border" /> : "Create Note"}
            </Button>
          </Form>
        </Card.Body>
      </Card>

      <h3>My Notes</h3>
      {loading ? (
        <Spinner animation="border" />
      ) : (
        <div>
          {notes.length === 0 ? (
            <Alert variant="info">No notes available.</Alert>
          ) : (
            notes.map((note) => (
              <Card key={note._id} className="mb-3">
                <Card.Body>
                  <Card.Title>{note.title}</Card.Title>
                  <Card.Text>{note.content}</Card.Text>
                  <div className="d-flex justify-content-end gap-2">
                    <Button
                      variant="outline-info"
                      onClick={() => handleShowModal(note)} // Show modal on click
                    >
                      <FaEdit /> View/Edit
                    </Button>
                    <Button
                      variant="outline-danger"
                      onClick={() => handleDeleteNote(note._id)}
                    >
                      <FaTrash /> Delete
                    </Button>
                    <Button
                      variant="outline-warning"
                      onClick={() => handlePinNote(note._id, note.pinned)}
                      disabled={loading}
                    >
                      <FaThumbtack /> {note.pinned ? "Unpin" : "Pin"}
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Modal for Viewing/Editing Notes */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedNote?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={selectedNote?.title || ""}
                onChange={handleNoteChange}
                readOnly={!editable}
                className={inputClass}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                name="content"
                value={selectedNote?.content || ""}
                onChange={handleNoteChange}
                readOnly={!editable}
                className={inputClass}
              />
            </Form.Group>
            <div className="d-flex justify-content-end gap-2">
              {editable ? (
                <Button
                  variant="outline-success"
                  onClick={handleUpdateNote}
                >
                  Save
                </Button>
              ) : (
                <Button
                  variant="outline-primary"
                  onClick={() => setEditable(true)} // Enable editing
                >
                  Edit
                </Button>
              )}
              <Button variant="outline-secondary" onClick={handleCloseModal}>
                Close
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Notes;
