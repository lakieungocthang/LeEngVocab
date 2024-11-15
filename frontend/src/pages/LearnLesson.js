import React, { useState, useEffect } from 'react';
import { getLessonsList, getVocabularyByLesson } from '../api';
import { Box, Typography, Select, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import BackToHomeButton from '../components/BackToHomeButton';
import BrandFooter from '../components/BrandFooter';
import './LearnLesson.css';

function LearnLesson() {
  const [lesson, setLesson] = useState('');
  const [learnData, setLearnData] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const lessonList = await getLessonsList();
        setLessons(lessonList);
      } catch (error) {
        console.error('Error fetching lessons:', error);
        setError('Error fetching lessons');
      }
    };

    fetchLessons();
  }, []);

  const handleLessonChange = async (e) => {
    const selectedLesson = e.target.value;
    setLesson(selectedLesson);
    if (selectedLesson) {
      try {
        const data = await getVocabularyByLesson(selectedLesson);
        setLearnData(data);
        setError(null);
      } catch (error) {
        setLearnData(null);
        setError('Error fetching learn data');
        console.error('Error fetching learn data:', error);
      }
    } else {
      setLearnData(null);
      setError(null);
    }
  };

  return (
    <Box className="learn-container">
      <BackToHomeButton />
      <Typography variant="h4" gutterBottom>Select a Lesson to Learn</Typography>
      <Select
        value={lesson}
        onChange={handleLessonChange}
        displayEmpty
        className="learn-select"
        sx={{ width: '200px', mb: 2 }}
      >
        <MenuItem value="">
          <em>Select a lesson</em>
        </MenuItem>
        {lessons.map((lesson) => (
          <MenuItem key={lesson} value={lesson}>
            {lesson}
          </MenuItem>
        ))}
      </Select>
      {error && <Typography color="error" sx={{ mt: 1 }}>{error}</Typography>}
      {learnData && (
        <TableContainer component={Paper} className="learn-content" sx={{ mt: 3, maxHeight: '60vh' }}>
          <Table stickyHeader aria-label="learn table">
            <TableHead>
              <TableRow>
                <TableCell><Typography variant="subtitle1" fontWeight="bold">English</Typography></TableCell>
                <TableCell><Typography variant="subtitle1" fontWeight="bold">Type</Typography></TableCell>
                <TableCell><Typography variant="subtitle1" fontWeight="bold">Vietnamese</Typography></TableCell>
                <TableCell><Typography variant="subtitle1" fontWeight="bold">Example</Typography></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {learnData.map((item, index) => (
                <TableRow key={index} hover>
                  <TableCell>{item.word}</TableCell>
                  <TableCell>{item.type}</TableCell>
                  <TableCell>{item.vietnamesedefinition}</TableCell>
                  <TableCell>{item.example}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <BrandFooter />
    </Box>
  );
}

export default LearnLesson;
