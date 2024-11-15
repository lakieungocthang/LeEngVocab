import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Box, Modal } from '@mui/material';
import BrandFooter from '../components/BrandFooter';
import LoginModal from '../components/LoginModal';
import VocabularyManagementModal from '../components/VocabularyManagementModal';
import Cookies from 'js-cookie';
import { getUserProfile } from '../api';
import './Home.css';

function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showVocabModal, setShowVocabModal] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get('authToken');
    setIsLoggedIn(!!token);

    if (token) {
      fetchUserProfile();
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      const profileData = await getUserProfile();
      setUserProfile(profileData);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    setShowLoginModal(false);
    fetchUserProfile();
  };

  const handleLogout = () => {
    Cookies.remove('authToken'); 
    setIsLoggedIn(false); 
    setUserProfile(null);
    alert('Logout successful!');
  };

  const handleProtectedClick = (path) => {
    if (isLoggedIn) {
      navigate(path);
    } else {
      setShowLoginModal(true);
    }
  };

  return (
    <Box className="home-container">
      {isLoggedIn && userProfile && (
        <Box
          sx={{
            position: 'fixed',
            top: 16,
            right: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            padding: '8px 12px',
            borderRadius: '8px',
            color: '#fff',
          }}
        >
          <Typography variant="body1" sx={{ mr: 1 }}>{userProfile.name}</Typography>
          <Typography variant="body2" sx={{ mr: 2 }}>{userProfile.email}</Typography>
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={handleLogout}
            sx={{ ml: 2 }}
          >
            Logout
          </Button>
        </Box>
      )}

      <Box className="home-content">
        <Typography variant="h3" component="h1" gutterBottom>
          Welcome to the Vocabulary Learning Platform
        </Typography>
        <Box className="home-buttons" sx={{ mt: 2, display: 'flex', gap: 2, justifyContent: 'center' }}>
          {isLoggedIn ? (
            <>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleProtectedClick('/quiz-type-selection')}
              >
                Select Quiz Type
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleProtectedClick('/learn-lesson')}
              >
                Learn Lesson
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => setShowVocabModal(true)}
              >
                Manage Vocabulary
              </Button>
            </>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={() => setShowLoginModal(true)}
            >
              Let's Start
            </Button>
          )}
        </Box>
      </Box>
      <BrandFooter />

      <Modal open={showLoginModal} onClose={() => setShowLoginModal(false)}>
        <LoginModal onClose={() => setShowLoginModal(false)} onLogin={handleLogin} />
      </Modal>

      <VocabularyManagementModal open={showVocabModal} onClose={() => setShowVocabModal(false)} />
    </Box>
  );
}

export default Home;
