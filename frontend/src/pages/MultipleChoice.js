import React, { useState, useEffect, useCallback } from 'react';
import { getLessonsList, getVocabularyByLesson } from '../api'; 
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { Button, Typography, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import BackToHomeButton from '../components/BackToHomeButton';
import BrandFooter from '../components/BrandFooter';
import './MultipleChoice.css';

function MultipleChoice() {
  const [lesson, setLesson] = useState('');
  const [quizData, setQuizData] = useState([]);
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState(new Set());
  const [questionStatus, setQuestionStatus] = useState([]);

  const handleStartQuiz = async () => {
    if (lesson) {
      try {
        const data = await getVocabularyByLesson(lesson); 
        const formattedData = formatQuizData(data);
        setQuizData(formattedData);
        setIsQuizStarted(true);
        setCurrentQuestionIndex(0);
        setSelectedAnswers(new Array(formattedData.length).fill(null));
        setFeedback(null);
        setScore(0);
        setAnsweredQuestions(new Set());
        setQuestionStatus(new Array(formattedData.length).fill(null));
      } catch (error) {
        alert('Error fetching quiz data:', error);
      }
    } else {
      alert('Please select a lesson.');
    }
  };

  const formatQuizData = (data) => {
    return data.map(item => {
      const options = generateOptions(item.vietnamesedefinition, data);
      return {
        question: item.word, 
        type: item.type,
        correctAnswer: item.vietnamesedefinition, 
        options: options
      };
    });
  };

  const handleAnswerSelect = (answer) => {
    updateSelectedAnswers(currentQuestionIndex, answer);
    if (answer === quizData[currentQuestionIndex].correctAnswer) {
      setFeedback('correct');
      if (!answeredQuestions.has(currentQuestionIndex)) {
        setScore(score + 1);
        setAnsweredQuestions(new Set(answeredQuestions).add(currentQuestionIndex));
        updateQuestionStatus(currentQuestionIndex, 'correct');
      }
    } else {
      setFeedback('incorrect');
      setAnsweredQuestions(new Set(answeredQuestions).add(currentQuestionIndex));
      updateQuestionStatus(currentQuestionIndex, 'incorrect');
    }
  };

  const handleNext = useCallback(() => {
    setFeedback(null);
    if (currentQuestionIndex < quizData.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  }, [currentQuestionIndex, quizData.length]);

  const handlePrevious = useCallback(() => {
    setFeedback(null);
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  }, [currentQuestionIndex]);

  const updateSelectedAnswers = (index, answer) => {
    const newSelectedAnswers = [...selectedAnswers];
    newSelectedAnswers[index] = answer;
    setSelectedAnswers(newSelectedAnswers);
  };

  const updateQuestionStatus = (index, status) => {
    const newStatus = [...questionStatus];
    newStatus[index] = status;
    setQuestionStatus(newStatus);
  };

  const handleJumpToQuestion = (index) => {
    setCurrentQuestionIndex(index);
    setFeedback(null);
  };

  const generateOptions = (correctAnswer, allData) => {
    const options = [correctAnswer];
    while (options.length < 4) {
      const randomOption = allData[Math.floor(Math.random() * allData.length)].vietnamesedefinition;
      if (!options.includes(randomOption)) {
        options.push(randomOption);
      }
    }
    return shuffleArray(options);
  };

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  return (
    <Box className="quiz-container">
      {!isQuizStarted ? (
        <StartQuiz 
          lesson={lesson} 
          setLesson={setLesson} 
          handleStartQuiz={handleStartQuiz} 
        />
      ) : (
        <Box className="quiz-wrapper" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <QuizContent 
            quizData={quizData} 
            currentQuestionIndex={currentQuestionIndex} 
            selectedAnswers={selectedAnswers} 
            feedback={feedback} 
            score={score} 
            answeredQuestions={answeredQuestions} 
            questionStatus={questionStatus} 
            handlePrevious={handlePrevious} 
            handleNext={handleNext} 
            handleAnswerSelect={handleAnswerSelect} 
            handleJumpToQuestion={handleJumpToQuestion} 
            setIsQuizStarted={setIsQuizStarted} 
          />
          <QuestionTracker 
            quizData={quizData} 
            questionStatus={questionStatus} 
            currentQuestionIndex={currentQuestionIndex} 
            handleJumpToQuestion={handleJumpToQuestion} 
          />
        </Box>
      )}
      <BrandFooter />
    </Box>
  );
}

const StartQuiz = ({ lesson, setLesson, handleStartQuiz }) => {
  const [lessons, setLessons] = useState([]);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const lessonList = await getLessonsList();
        setLessons(lessonList);
      } catch (error) {
        console.error('Error fetching lessons:', error);
      }
    };

    fetchLessons();
  }, []);

  return (
    <Box className="quiz-start" sx={{ textAlign: 'center', mt: 3 }}>
      <BackToHomeButton />
      <Typography variant="h4" gutterBottom>Select a lesson to start the quiz</Typography>
      <FormControl fullWidth sx={{ mt: 2, mb: 2 }}>
        <InputLabel>Lesson</InputLabel>
        <Select value={lesson} onChange={(e) => setLesson(e.target.value)} label="Lesson">
          <MenuItem value=""><em>Select a lesson</em></MenuItem>
          {lessons.map((lesson) => (
            <MenuItem key={lesson} value={lesson}>
              {lesson}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button variant="contained" color="primary" onClick={handleStartQuiz}>Start Quiz</Button>
    </Box>
  );
};

const QuizContent = ({
  quizData,
  currentQuestionIndex,
  selectedAnswers,
  feedback,
  score,
  answeredQuestions,
  questionStatus,
  handlePrevious,
  handleNext,
  handleAnswerSelect,
  handleJumpToQuestion,
  setIsQuizStarted
}) => (
  <Box className="quiz-content" sx={{ textAlign: 'center', mt: 3 }}>
    <Button variant="contained" color="secondary" onClick={() => setIsQuizStarted(false)} sx={{ mb: 2 }}>Back to Lesson Selection</Button>
    <Typography variant="h4" sx={{ mb: 2 }}>
      {quizData[currentQuestionIndex].question} ({quizData[currentQuestionIndex].type})
    </Typography>
    <Box className="options">
      {quizData[currentQuestionIndex].options.map((option, index) => (
        <Button
          key={index}
          variant="outlined"
          className={`option-button ${
            selectedAnswers[currentQuestionIndex] === option
              ? questionStatus[currentQuestionIndex] === 'correct'
                ? 'correct'
                : 'incorrect'
              : ''
          }`}
          onClick={() => handleAnswerSelect(option)}
          disabled={answeredQuestions.has(currentQuestionIndex)}
        >
          {option}
        </Button>
      ))}
    </Box>
    {feedback && (
      <Typography variant="body1" sx={{ mt: 2, color: feedback === 'correct' ? 'green' : 'red' }}>
        {feedback === 'correct' ? 'Correct!' : 'Incorrect, try again.'}
      </Typography>
    )}
    <NavigationButtons 
      handlePrevious={handlePrevious} 
      handleNext={handleNext} 
      currentQuestionIndex={currentQuestionIndex} 
      totalQuestions={quizData.length} 
    />
    <Typography variant="body1" sx={{ mt: 2 }}>Score: {score}</Typography>
  </Box>
);

const NavigationButtons = ({ handlePrevious, handleNext, currentQuestionIndex, totalQuestions }) => (
  <Box className="navigation-buttons" sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
    <Button onClick={handlePrevious} sx={{ mx: 1 }} disabled={currentQuestionIndex === 0}>
      <FaArrowLeft />
    </Button>
    <Button onClick={handleNext} sx={{ mx: 1 }} disabled={currentQuestionIndex >= totalQuestions - 1}>
      <FaArrowRight />
    </Button>
  </Box>
);

const QuestionTracker = ({ quizData, questionStatus, currentQuestionIndex, handleJumpToQuestion }) => (
  <Box className="question-tracker" sx={{ mt: 3 }}>
    <Box display="flex" justifyContent="center" flexWrap="wrap">
      {quizData.map((_, index) => (
        <Button
          key={index}
          onClick={() => handleJumpToQuestion(index)}
          sx={{ m: 0.5 }}
          variant="contained"
          color={
            questionStatus[index] === 'correct' ? 'success' :
            questionStatus[index] === 'incorrect' ? 'error' :
            'primary'
          }          
        >
          {index + 1}
        </Button>
      ))}
    </Box>
  </Box>
);


export default MultipleChoice;
