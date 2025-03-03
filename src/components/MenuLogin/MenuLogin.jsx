import React, { useState, useEffect } from 'react';
import MenuRegister from '../MenuRegister/MenuRegister';
import { useNavigate } from "react-router-dom";
import './MenuLogin.css';

function MenuLogin({ setIsMenuOpen, handleLogin }) {
  const [isMenuOpen, setIsMenuOpenState] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  // Функция для отключения прокрутки
  const disableScroll = () => {
    document.body.style.overflow = 'hidden';
  };

  // Функция для включения прокрутки
  const enableScroll = () => {
    document.body.style.overflow = 'auto';
  };

  // useEffect, чтобы управлять прокруткой
  useEffect(() => {
    if (isMenuOpen) {
      disableScroll();
    } else {
      enableScroll();
    }

    return () => {
      enableScroll(); // Очистка при размонтировании компонента
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpenState(!isMenuOpen);
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpenState(false);
    setIsMenuOpen(false);
    setIsRegistering(false);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault(); // Останавливаем стандартное поведение формы
    setError(''); // Очищаем старую ошибку перед новым запросом

    const userData = { login, password };

    try {
      await handleLogin(userData); // Передаем данные для входа в родительский компонент
      setIsMenuOpen(false); // Закрываем меню после успешного входа
      navigate("/", { state: { notification: { message: "Вы успешно вошли.", type: "success" } } });
    } catch (err) {
      setError('Ошибка при входе. Проверьте данные и попробуйте снова.');
    }
  };

  return (
    <div>
      <button className="menu-button" onClick={toggleMenu}>
        Войти
      </button>

      <div className={`overlay ${isMenuOpen ? 'active' : ''}`} onClick={closeMenu}></div>

      {isMenuOpen && (
        <div className="menu-login">
          <button className="close-button" onClick={closeMenu}>×</button>

          {isRegistering ? (
            <MenuRegister setIsRegistering={setIsRegistering} setIsMenuOpen={setIsMenuOpen} handleLogin={handleLogin} />
          ) : (
            <>
              <h3>Вход</h3>
              <form onSubmit={handleLoginSubmit}>
                <div className="form-group">
                  <input
                    type="text"
                    id="login"
                    placeholder="Введите логин"
                    value={login}
                    onChange={(e) => setLogin(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="password"
                    id="password"
                    placeholder="Введите пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <button type="submit">Войти</button>
              </form>
              {error && <p className="error">{error}</p>}
              <span className="register-link" onClick={() => setIsRegistering(true)}>
                Зарегистрироваться
              </span>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default MenuLogin;
