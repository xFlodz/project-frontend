import axios from 'axios';

const API_URL = 'http://localhost:5000/api/post';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export const createPost = async (postData) => {
  try {
    const response = await axiosInstance.post('/create', postData, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('refresh_token')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Ошибка при создании поста:', error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

export const getAllPosts = async ({ dateFilterType, tagsFilter, startDate, endDate }) => {
  try {
    const response = await axiosInstance.post('/get_all_posts', { 
      dateFilterType,
      tagsFilter,
      startDate,
      endDate,
    }, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('refresh_token')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Ошибка при получении всех постов:', error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

export const getPostByAddress = async (postAddress) => {
  try {
    const response = await axiosInstance.get(`/get_post/${postAddress}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('refresh_token')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Ошибка при получении поста по адресу:', error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

export const updatePost = async (postId, updatedData) => {
  try {
    const response = await axiosInstance.put(`/edit/${postId}`, updatedData, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('refresh_token')}`, 
      },
    });
    return response.data;
  } catch (error) {
    console.error('Ошибка при редактировании поста:', error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

// Функция удаления поста
export const deletePost = async (postAddress) => {
  try {
    await axiosInstance.delete(`/delete/${postAddress}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('refresh_token')}`,
      },
    });
  } catch (error) {
    console.error('Ошибка при удалении поста:', error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};
