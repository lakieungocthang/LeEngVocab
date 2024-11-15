import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';

const Home = lazy(() => import('./pages/Home'));
const QuizTypeSelection = lazy(() => import('./pages/QuizTypeSelection'));
const FillInQuiz = lazy(() => import('./pages/FillInQuiz'));
const MultipleChoice = lazy(() => import('./pages/MultipleChoice'));
const LearnLesson = lazy(() => import('./pages/LearnLesson'));

function App() {
  return (
    <Router>
      <div className="App">
        <ErrorBoundary>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route
                path="/quiz-type-selection"
                element={
                  <ProtectedRoute>
                    <QuizTypeSelection />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/quiz/fill-in"
                element={
                  <ProtectedRoute>
                    <FillInQuiz />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/quiz/multiple-choice"
                element={
                  <ProtectedRoute>
                    <MultipleChoice />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/learn-lesson"
                element={
                  <ProtectedRoute>
                    <LearnLesson />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </div>
    </Router>
  );
}

export default App;
