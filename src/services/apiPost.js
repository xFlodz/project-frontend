import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000/api/post';

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
    });
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Ошибка при получении всех постов:', error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

export const searchPosts = async ({ query, dateFilterType, tagsFilter, startDate, endDate }) => {
  try {
    const response = await axiosInstance.post('/search', { 
      query,
      dateFilterType,
      tagsFilter,
      startDate,
      endDate
    }, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('refresh_token')}`,
      },
    });
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Ошибка при поиске постов:', error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

export const getPostByAddress = async (postAddress, fingerprint) => {
  try {
    const response = await axiosInstance.get(`/get_post/${postAddress}`, {
      params: { fingerprint },
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

export const getAllUserPosts = async ({ dateFilterType, tagsFilter, startDate, endDate }) => {
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
    console.error('Ошибка при получении постов пользователя:', error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

export const getAllNotApprovedPosts = async ({ dateFilterType, tagsFilter, startDate, endDate }) => {
  try {
    const response = await axiosInstance.post('/get_all_not_approved_posts', { 
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
    console.error('Ошибка при получении не одобренных постов:', error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

export const approvePost = async (postAddress) => {
  try {
    const response = await axiosInstance.put(`/approve/${postAddress}`, {}, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('refresh_token')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Ошибка при одобрении поста:', error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

export const getSearchSuggestions = async (query, limit = 5) => {
  try {
    const response = await axiosInstance.get('/search/suggest', {
      params: {
        query,
        limit
      },
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('refresh_token')}`,
      }
    });
    return response.data;
  } catch (error) {
    console.error('Ошибка при получении подсказок:', error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

export const getUserPosts = async (userId) => {
  try {
    const response = await axiosInstance.get(`/get_user_posts`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('refresh_token')}`,
      },
      params: {userId}
    });
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Ошибка при получении постов пользователя:', error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

export const LikePost = async (postAddress, fingerprint) => {
  try {
    const response = await axiosInstance.get(`/add_like_to_post/${postAddress}`, {
      params: { fingerprint },
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
