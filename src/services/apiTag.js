import axios from 'axios';

const API_URL = 'http://127.0.0.1:5002/api/tag';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export const createTag = async (tagData) => {
  try {
    const response = await axiosInstance.post('/create', tagData, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('refresh_token')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Ошибка при создании тега:', error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

export const deleteTag = async (tagId) => {
  try {
    const response = await axiosInstance.delete(`/delete/${tagId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('refresh_token')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Ошибка при удалении тега:', error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

export const getAllTags = async () => {
  try {
    const response = await axiosInstance.get('/get_all_tags', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('refresh_token')}`, 
      },
    });
    return response.data;
  } catch (error) {
    console.error('Ошибка при получении всех тегов:', error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};
