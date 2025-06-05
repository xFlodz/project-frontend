import axios from 'axios';

const API_URL = 'http://127.0.0.1:5001/api/user';

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const registerUser = async (userData) => {
  try {
    const response = await axiosInstance.post('/register', userData);
    return response.data;
  } catch (error) {
    console.error('Ошибка при регистрации:', error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

export const loginUser = async (userData) => {
  try {
    const response = await axiosInstance.post('/login', userData);

    if (response.data.access_token) {
      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('refresh_token', response.data.refresh_token);
      localStorage.setItem('role', response.data.role);
      localStorage.setItem('id', response.data.id)
    }

    return response.data;
  } catch (error) {
    console.error('Ошибка при входе:', error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

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

export const logoutUser = async () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('role');
  localStorage.removeItem('id')
};

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

export const approveUser = async (userID) => {
  try {
    const response = await axiosInstance.post('/approve_user', { user_id: userID }, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('refresh_token')}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Ошибка при одобрении пользователя:', error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

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

export const getUserById = async (id) => {
  try {
    const response = await axiosInstance.get(`/get_user_by_id/${id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('refresh_token')}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error(`Ошибка при получении пользователя с ID ${id}:`, error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

export const changePassword = async (passwordData) => {
  try {
    const response = await axiosInstance.post('/change_password', passwordData, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Ошибка при смене пароля:', error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

export const updateProfile = async (profileData) => {
  try {
    const response = await axiosInstance.post('/update_profile', profileData, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error('Ошибка при обновлении профиля:', error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

export const changeRole = async (userId, newRole) => {
  try {
    const response = await axiosInstance.post('/change_role', { userId, newRole }, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('refresh_token')}`,
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error('Ошибка при обновлении профиля:', error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await axiosInstance.post('/delete_user', { userId: userId }, {
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