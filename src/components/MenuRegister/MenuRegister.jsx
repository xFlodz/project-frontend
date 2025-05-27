import React, { useState } from 'react';
import './MenuRegister.css';
import { useNavigate } from "react-router-dom";
import { registerUser } from '../../services/apiUser';
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

function MenuRegister({ setIsRegistering, setIsMenuOpen, handleLogin }) {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = { name, surname, email, password };
    const login = email;
    const loginData = { login, password };

    try {
      const result = await registerUser(userData);
      console.log('Пользователь успешно зарегистрирован:', result);

      await handleLogin(loginData);
      setIsRegistering(false);
      setIsMenuOpen(false);

      navigate("/", { state: { notification: { message: "Вы успешно зарегестрировались.", type: "success" } } });
    } catch (error) {
      setError('Пользователь уже существует');
      navigate("/", { state: { notification: { message: "Ошибка регистрации", type: "error" } } });
    }
  };

  return (
    <>
      <h3>Регистрация</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
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
        <div className="form-group password-group">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Введите пароль"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
          </span>
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
