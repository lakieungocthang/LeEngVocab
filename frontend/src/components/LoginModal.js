import React, { useState } from 'react';
import Cookies from 'js-cookie';
import * as Yup from 'yup';
import { loginUser, registerUser } from '../api';
import { Box, Button, Typography, TextField, Dialog, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const loginSchema = Yup.object().shape({
  username: Yup.string().required('Username is required'),
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters long'),
});

const registerSchema = Yup.object().shape({
  username: Yup.string().required('Username is required'),
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters long'),
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email format').required('Email is required'),
});

function LoginModal({ onClose, onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const validateField = async (field, value) => {
    try {
      const schema = isLogin ? loginSchema : registerSchema;
      await schema.validateAt(field, { [field]: value });
      setErrors((prevErrors) => ({ ...prevErrors, [field]: '' }));
    } catch (error) {
      setErrors((prevErrors) => ({ ...prevErrors, [field]: error.message }));
    }
  };

  const handleFieldChange = (field, value) => {
    if (field === 'username') setUsername(value);
    if (field === 'password') setPassword(value);
    if (field === 'name') setName(value);
    if (field === 'email') setEmail(value);
    validateField(field, value);
  };

  const handleLogin = async () => {
    try {
      await loginSchema.validate({ username, password });
      const token = await loginUser({ username, password });
      const expires = new Date();
      expires.setHours(expires.getHours() + 1);
      Cookies.set('authToken', token, { expires });
      onLogin();
      setMessage('');
      resetFields();
      alert('Login successful!');
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleRegister = async () => {
    try {
      await registerSchema.validate({ username, password, name, email });
      await registerUser({ username, password, name, email });
      setIsLogin(true);
      setMessage('Registration successful! Please log in.');
      resetFields();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const resetFields = () => {
    setUsername('');
    setPassword('');
    setName('');
    setEmail('');
    setErrors({});
  };

  return (
    <Dialog open onClose={onClose} maxWidth="xs" fullWidth>
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>{isLogin ? 'Login' : 'Register'}</Typography>
        {message && <Typography color="primary" sx={{ mb: 2 }}>{message}</Typography>}
        
        {!isLogin && (
          <>
            <TextField
              label="Name"
              value={name}
              onChange={(e) => handleFieldChange('name', e.target.value)}
              error={!!errors.name}
              helperText={errors.name}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => handleFieldChange('email', e.target.value)}
              error={!!errors.email}
              helperText={errors.email}
              fullWidth
              sx={{ mb: 2 }}
            />
          </>
        )}

        <TextField
          label="Username"
          value={username}
          onChange={(e) => handleFieldChange('username', e.target.value)}
          error={!!errors.username}
          helperText={errors.username}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="Password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => handleFieldChange('password', e.target.value)}
          error={!!errors.password}
          helperText={errors.password}
          fullWidth
          sx={{ mb: 2 }}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />

        <Button
          variant="contained"
          color="primary"
          onClick={isLogin ? handleLogin : handleRegister}
          fullWidth
          sx={{ mb: 2 }}
        >
          {isLogin ? 'Login' : 'Register'}
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={onClose}
          fullWidth
          sx={{ mb: 2 }}
        >
          Close
        </Button>

        <Typography
          variant="body2"
          color="primary"
          onClick={() => { setIsLogin(!isLogin); setMessage(''); resetFields(); }}
          sx={{ cursor: 'pointer', textDecoration: 'underline', mt: 1 }}
        >
          {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
        </Typography>
      </Box>
    </Dialog>
  );
}

export default LoginModal;
