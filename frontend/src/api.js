import axios from 'axios';
import Cookies from 'js-cookie';

const AUTH_SERVICE_URL = 'http://localhost:5001/auth-service/api';
const USER_PROFILE_SERVICE_URL = 'http://localhost:5002/user-profile-service/api';
const VOCABULARY_SERVICE_URL = 'http://localhost:5003/vocabulary-service/api';

const axiosInstance = axios.create({
    timeout: 5000,
});

axiosInstance.interceptors.request.use((config) => {
    const token = Cookies.get('authToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const registerUser = async (userData) => {
    try {
        const response = await axiosInstance.post(`${AUTH_SERVICE_URL}/register`, userData);
        return response.data;
    } catch (error) {
        console.error('Error registering user:', error);
        throw error;
    }
};

export const loginUser = async (credentials) => {
    try {
        const response = await axios.post(`${AUTH_SERVICE_URL}/login`, credentials);
        const { token } = response.data;

        Cookies.set('authToken', token, { expires: 1 });
        return token;
    } catch (error) {
        console.error('Error logging in user:', error);
        throw error;
    }
};

export const getUserProfile = async () => {
    try {
        const response = await axiosInstance.get(`${USER_PROFILE_SERVICE_URL}/profile`);
        return response.data;
    } catch (error) {
        console.error('Error fetching user profile:', error);
        throw error;
    }
};

export const createUserProfile = async (profileData) => {
    try {
        const response = await axiosInstance.post(`${USER_PROFILE_SERVICE_URL}`, profileData);
        return response.data;
    } catch (error) {
        console.error('Error creating user profile:', error);
        throw error;
    }
};

export const updateUserProfile = async (profileData) => {
    try {
        const response = await axiosInstance.put(`${USER_PROFILE_SERVICE_URL}/profile`, profileData);
        return response.data;
    } catch (error) {
        console.error('Error updating user profile:', error);
        throw error;
    }
};

export const getVocabularyByLesson = async (lesson) => {
    try {
        const response = await axiosInstance.get(`${VOCABULARY_SERVICE_URL}/${lesson}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching vocabulary:', error);
        throw error;
    }
};

export const addVocabulary = async (vocabData) => {
    try {
        const response = await axiosInstance.post(`${VOCABULARY_SERVICE_URL}`, vocabData);
        return response.data;
    } catch (error) {
        console.error('Error adding vocabulary:', error);
        throw error;
    }
};

export const getLessonsList = async () => {
    try {
        const response = await axiosInstance.get(`${VOCABULARY_SERVICE_URL}/lessons/list`);
        return response.data;
    } catch (error) {
        console.error('Error fetching lessons list:', error);
        throw error;
    }
};

export const deleteVocabulary = async (lesson, word) => {
    try {
        const response = await axiosInstance.delete(`${VOCABULARY_SERVICE_URL}/${lesson}/${word}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting vocabulary:', error);
        throw error;
    }
  };