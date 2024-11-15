// src/components/VocabularyManagementModal.js
import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, TextField, Modal, List, ListItem, ListItemText, IconButton, Divider } from '@mui/material';
import { addVocabulary, getLessonsList, getVocabularyByLesson, deleteVocabulary } from '../api';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

function VocabularyManagementModal({ open, onClose }) {
  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [newLessonName, setNewLessonName] = useState('');
  const [vocabularies, setVocabularies] = useState([{ word: '', type: '', vietnamesedefinition: '', example: '' }]);
  const [lessonVocabularies, setLessonVocabularies] = useState([]);
  const [showAddLessonForm, setShowAddLessonForm] = useState(false);

  useEffect(() => {
    if (open) {
      fetchLessons();
    }
  }, [open]);

  const fetchLessons = async () => {
    try {
      const lessonList = await getLessonsList();
      setLessons(lessonList);
    } catch (error) {
      console.error('Error fetching lessons:', error);
    }
  };

  const handleLessonSelect = async (lesson) => {
    setSelectedLesson(lesson);
    setShowAddLessonForm(false);
    setNewLessonName(lesson);
    await fetchVocabularyByLesson(lesson);
  };

  const fetchVocabularyByLesson = async (lesson) => {
    try {
      const vocabList = await getVocabularyByLesson(lesson);
      setLessonVocabularies(vocabList);
    } catch (error) {
      console.error('Error fetching vocabulary:', error);
    }
  };

  const handleDeleteVocabulary = async (lesson, word) => {
    try {
      await deleteVocabulary(lesson, word);
      setLessonVocabularies((prev) => prev.filter((vocab) => vocab.word !== word));
    } catch (error) {
      console.error('Error deleting vocabulary:', error);
      alert('Failed to delete vocabulary. Please try again.');
    }
  };

  const handleVocabularyChange = (index, field, value) => {
    const updatedVocabularies = [...vocabularies];
    updatedVocabularies[index][field] = value;
    setVocabularies(updatedVocabularies);
  };

  const handleAddMoreVocabulary = () => {
    setVocabularies([...vocabularies, { word: '', type: '', vietnamesedefinition: '', example: '' }]);
  };

  const handleRemoveVocabulary = (index) => {
    const updatedVocabularies = vocabularies.filter((_, i) => i !== index);
    setVocabularies(updatedVocabularies);
  };

  const handleAddVocabularies = async () => {
    const lesson = selectedLesson || newLessonName;

    const hasValidVocab = vocabularies.some(vocab => vocab.word && vocab.type);
    if (!hasValidVocab) {
      alert('Please add at least one vocabulary word before saving.');
      return;
    }

    try {
      await Promise.all(
        vocabularies
          .filter(vocab => vocab.word && vocab.type)
          .map((vocabData) => addVocabulary({ ...vocabData, lesson }))
      );
      alert('Vocabularies added successfully!');
      fetchLessons();
      resetForm();
    } catch (error) {
      console.error('Error adding vocabularies:', error);
      alert('Failed to add vocabularies. Please try again.');
    }
  };

  const resetForm = () => {
    setVocabularies([{ word: '', type: '', vietnamesedefinition: '', example: '' }]);
    setNewLessonName('');
    setSelectedLesson(null);
    setLessonVocabularies([]);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 500,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        borderRadius: 2,
      }}>
        <Typography variant="h6" component="h2" gutterBottom>
          Manage Vocabulary
        </Typography>

        {lessons.length > 0 ? (
          <List>
            {lessons.map((lesson) => (
              <ListItem button key={lesson} onClick={() => handleLessonSelect(lesson)}>
                <ListItemText primary={`Lesson ${lesson}`} />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography variant="body2" color="textSecondary">
            No lessons available. Please add a new lesson.
          </Typography>
        )}

        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => { setShowAddLessonForm(true); setSelectedLesson(null); }}
          >
            Add New Lesson
          </Button>
        </Box>

        {/* Add Vocabulary to Selected/New Lesson */}
        {(showAddLessonForm || selectedLesson) && (
          <Box sx={{ mt: 3 }}>
            <TextField
              label="Lesson Name"
              value={selectedLesson || newLessonName}
              onChange={(e) => setNewLessonName(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
              disabled={!!selectedLesson}
            />

            {vocabularies.map((vocab, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <TextField
                  label="Word"
                  name="word"
                  value={vocab.word}
                  onChange={(e) => handleVocabularyChange(index, 'word', e.target.value)}
                  fullWidth
                />
                <TextField
                  label="Type"
                  name="type"
                  value={vocab.type}
                  onChange={(e) => handleVocabularyChange(index, 'type', e.target.value)}
                  fullWidth
                />
                <TextField
                  label="Vietnamese Definition"
                  name="vietnamesedefinition"
                  value={vocab.vietnamesedefinition}
                  onChange={(e) => handleVocabularyChange(index, 'vietnamesedefinition', e.target.value)}
                  fullWidth
                />
                <TextField
                  label="Example"
                  name="example"
                  value={vocab.example}
                  onChange={(e) => handleVocabularyChange(index, 'example', e.target.value)}
                  fullWidth
                />
                <IconButton onClick={() => handleRemoveVocabulary(index)} color="error">
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}

            <Button
              variant="outlined"
              onClick={handleAddMoreVocabulary}
              startIcon={<AddIcon />}
              fullWidth
              sx={{ mb: 2 }}
            >
              Add More Vocabulary
            </Button>

            <Button variant="contained" color="primary" onClick={handleAddVocabularies} fullWidth>
              Save Vocabularies
            </Button>
          </Box>
        )}

        {selectedLesson && lessonVocabularies.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Vocabulary List for Lesson {selectedLesson}
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {lessonVocabularies.map((vocab) => (
              <ListItem key={vocab._id} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <ListItemText
                  primary={vocab.word}
                  secondary={`Type: ${vocab.type}, Definition: ${vocab.vietnamesedefinition}`}
                />
                <IconButton onClick={() => handleDeleteVocabulary(selectedLesson, vocab.word)} color="error">
                  <DeleteIcon />
                </IconButton>
              </ListItem>
            ))}
          </Box>
        )}
      </Box>
    </Modal>
  );
}

export default VocabularyManagementModal;
