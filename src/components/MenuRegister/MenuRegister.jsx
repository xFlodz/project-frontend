import React, { useState } from 'react';
import './MenuRegister.css';
import { useNavigate } from "react-router-dom";
import { registerUser } from '../../services/apiUser';
import Notification from "../../components/Notification/Notification";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import InputMask from 'react-input-mask';

function MenuRegister({ setIsRegistering, closeMenu, handleLogin }) {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [thirdname, setThirdname] = useState('');
  const [phone, setPhone] = useState('');
  const [telegramId, setTelegramId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [notification, setNotification] = useState({ message: "", type: "" });
  const navigate = useNavigate();

  const validateFields = () => {
  const nameRegex = /^[А-Яа-яA-Za-z\- ]+$/;
  const phoneRegex = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;
  const telegramRegex = /^@[\w\d_]{3,}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!nameRegex.test(name)) return 'Имя может содержать только буквы и дефис.';
    if (!nameRegex.test(surname)) return 'Фамилия может содержать только буквы и дефис.';
    if (thirdname && !nameRegex.test(thirdname)) return 'Отчество может содержать только буквы и дефис.';
    if (phone && !phoneRegex.test(phone)) return 'Телефон должен быть в формате +7 (XXX) XXX-XX-XX.';
    if (telegramId && !telegramRegex.test(telegramId)) return 'ID Telegram должен начинаться с @ и содержать буквы, цифры или подчеркивания.';
    if (!emailRegex.test(email)) return 'Введите корректный email.';
    //if (password.length < 8) return 'Пароль должен быть не менее 8 символов.';
    if (password !== confirmPassword) return 'Пароли не совпадают.';

    return null;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateFields();
    if (validationError) {
      setError(validationError);
      return;
    }

    const userData = {
      name,
      surname,
      thirdname,
      phone,
      telegram_id: telegramId,
      email,
      password
    };

    const login = email;
    const loginData = { login, password };

    try {
      const result = await registerUser(userData);
      //console.log('Пользователь успешно зарегистрирован:', result);
      setNotification({ message: "Вы успешно зарегестрировались. Ожидайте подтверждения регистрации.", type: "success" });
      closeMenu();
      navigate("/", {
          state: {
            notification: {
              message: "Вы успешно зарегестрировались. Ожидайте подтверждения регистрации.",
              type: "success"
            }
          }
        });
      } catch (error) {
      setError('Пользователь уже существует');
      navigate("/", {
        state: {
          notification: {
            message: "Ошибка регистрации",
            type: "error"
          }
        }
      });
    }
  };

  return (
    <>
      <h3>Регистрация</h3>
      {error && <div className="error-message">{error}</div>}
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
            type="text"
            placeholder="Введите отчество"
            value={thirdname}
            onChange={(e) => setThirdname(e.target.value)}
          />
        </div>
        <div className="form-group">
          <InputMask
            mask="+7 (999) 999-99-99"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+7 (___) ___-__-__"
            required
          >
            {(inputProps) => <input type="tel" {...inputProps} />}
          </InputMask>
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="@ТелеграмАйди"
            value={telegramId}
            onChange={(e) => {
              let value = e.target.value;
              if (!value.startsWith('@')) {
                value = '@' + value.replace(/^@*/, '');
              }
              setTelegramId(value);
            }}
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
            placeholder="Введите пароль (мин. 8 символов)"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
          </span>
        </div>
        <div className="form-group password-group">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Повторите пароль"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <span className="toggle-password" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
            {showConfirmPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
          </span>
        </div>
        <button type="submit">Зарегистрироваться</button>
      </form>
      <span className="login-link" onClick={() => setIsRegistering(false)}>
        Уже есть аккаунт? Войти
      </span>
      <Notification
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ message: "", type: "" })}
      />
    </>
  );
}

export default MenuRegister;
