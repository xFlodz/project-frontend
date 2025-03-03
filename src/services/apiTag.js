import axios from 'axios';

const API_URL = 'http://localhost:5000/api/tag';  // Убедитесь, что у вас правильный URL Flask API для тегов

// Создаем экземпляр axios для удобства настройки
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Функция для создания тега
export const createTag = async (tagData) => {
  try {
    const response = await axiosInstance.post('/create', tagData, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('refresh_token')}`,  // Если необходимо отправлять токен
      },
    });
    return response.data;
  } catch (error) {
    console.error('Ошибка при создании тега:', error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

// Функция для удаления тега
export const deleteTag = async (tagId) => {
  try {
    const response = await axiosInstance.delete(`/delete/${tagId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('refresh_token')}`,  // Если необходимо отправлять токен
      },
    });
    return response.data;
  } catch (error) {
    console.error('Ошибка при удалении тега:', error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

// Функция для получения всех тегов
export const getAllTags = async () => {
  try {
    const response = await axiosInstance.get('/get_all_tags', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('refresh_token')}`,  // Если необходимо отправлять токен
      },
    });
    return response.data;
  } catch (error) {
    console.error('Ошибка при получении всех тегов:', error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};
