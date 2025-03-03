import React, { useState } from 'react';
import './MenuRegister.css'; // Подключаем стили
import { useNavigate } from "react-router-dom";
import { registerUser } from '../../services/apiUser'; // Импортируем функцию

function MenuRegister({ setIsRegistering, setIsMenuOpen, handleLogin }) {
  // Состояния для хранения значений полей формы
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');  // Для ошибок
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Отменяем стандартное поведение формы (перезагрузка страницы)

    // Формируем объект данных для отправки
    const userData = { name, surname, email, password };

    const login = email;
    const loginData = { login, password };

    try {
      // Вызываем функцию из apiUser.js
      const result = await registerUser(userData);
      console.log('Пользователь успешно зарегистрирован:', result);

      // Выполняем вход пользователя
      await handleLogin(loginData);

      // Закрываем окно регистрации
      setIsRegistering(false);
      setIsMenuOpen(false);  // Закрываем окно входа/регистрации

      // Перенаправляем на главную страницу с уведомлением
      navigate("/", { state: { notification: { message: "Вы успешно зарегестрировались.", type: "success" } } });
    } catch (error) {
      // Если ошибка, выводим сообщение
      setError('Пользователь уже существует');
      navigate("/", { state: { notification: { message: "Ошибка регистрации", type: "error" } } });
    }
  };

  return (
    <>
      <h3>Регистрация</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Отображаем ошибку */}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Введите имя"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Введите фамилию"
            required
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            placeholder="Введите email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Введите пароль"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Зарегистрироваться</button>
      </form>
      <span className="login-link" onClick={() => setIsRegistering(false)}>
        Уже есть аккаунт? Войти
      </span>
    </>
  );
}

export default MenuRegister;
