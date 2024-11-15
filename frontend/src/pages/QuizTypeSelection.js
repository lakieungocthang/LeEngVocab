import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import BackToHomeButton from '../components/BackToHomeButton';
import BrandFooter from '../components/BrandFooter';
import './QuizTypeSelection.css';

function QuizTypeSelection() {
  return (
    <Box className="quiz-type-selection-container">
      <Box className="quiz-type-selection-content">
        <BackToHomeButton />
        <Typography variant="h4" component="h1" gutterBottom>
          Select Quiz Type
        </Typography>
        <Box className="quiz-options">
          <Button
            component={Link}
            to="/quiz/fill-in"
            variant="contained"
            color="primary"
          >
            Fill in English
          </Button>
          <Button
            component={Link}
            to="/quiz/multiple-choice"
            variant="contained"
            color="primary"
          >
            Multiple Choice
          </Button>
        </Box>
      </Box>
      <BrandFooter />
    </Box>
  );
}

export default QuizTypeSelection;
