import axios from 'axios';

const API_URL = 'http://localhost:5000/api/user';  // Убедитесь, что у вас правильный URL Flask API

// Создаем экземпляр axios для удобства настройки
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Функция для регистрации пользователя
export const registerUser = async (userData) => {
  try {
    const response = await axiosInstance.post('/register', userData);
    return response.data;
  } catch (error) {
    console.error('Ошибка при регистрации:', error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

// Функция для логина пользователя
export const loginUser = async (userData) => {
  try {
    const response = await axiosInstance.post('/login', userData);

    if (response.data.access_token) {
      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('refresh_token', response.data.refresh_token);
      console.log(response.data.role)
      localStorage.setItem('role', response.data.role);
    }

    return response.data;
  } catch (error) {
    console.error('Ошибка при входе:', error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

// Функция для обновления токена
export const refreshAuthToken = async () => {
  try {
    const response = await axiosInstance.post('/refresh', null, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('refresh_token')}`,
      },
    });

    if (response.data.access_token) {
      localStorage.setItem('access_token', response.data.access_token);
    }

    return response.data;
  } catch (error) {
    console.error('Ошибка при обновлении токена:', error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

// Функция для выхода пользователя
export const logoutUser = async () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('role');
};

// Функция для получения всех редакторов
export const getAllEditors = async () => {
  try {
    const response = await axiosInstance.get('/get_editors', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('refresh_token')}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Ошибка при получении редакторов:', error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

// Функция для добавления нового редактора
export const createEditor = async (editorEmail) => {
  try {
    const response = await axiosInstance.post('/add_editor', { email: editorEmail }, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('refresh_token')}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Ошибка при добавлении редактора:', error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

export const deleteEditor = async (editorEmail) => {
  try {
    const response = await axiosInstance.post('/delete_editor', { email: editorEmail }, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('refresh_token')}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Ошибка при удалении редактора:', error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};