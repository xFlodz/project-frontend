import React, { useState, useEffect } from 'react';
import MenuRegister from '../MenuRegister/MenuRegister';
import { useNavigate } from "react-router-dom";
import './MenuLogin.css';

function MenuLogin({ setIsMenuOpen, handleLogin, setNotification }) {
  const [isMenuOpen, setIsMenuOpenState] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Управление скроллом
  useEffect(() => {
    const overlay = document.querySelector('.overlay');
    const menuLogin = document.querySelector('.menu-login');

    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';

      const headerHeight = 115;
      overlay.style.top = `${headerHeight}px`;
      overlay.style.height = `calc(100vh - ${headerHeight}px)`;
      menuLogin.style.top = `${headerHeight + 60}px`;
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpenState(!isMenuOpen);
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpenState(false);
    setIsMenuOpen(false);
    setLogin('');
    setPassword('');
    setError('');
    setIsRegistering(false); // Если нужно при закрытии сбрасывать и регистрацию тоже
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const result = await handleLogin({ login, password });

    if (result.success) {
      setIsMenuOpen(false);
      setNotification({ message: "Вы успешно вошли.", type: "success" });
      navigate("/");  // редирект
    } else {
      setError(result.message || "Ошибка при входе.");
    }
  };


  return (
    <div>
      <button className="menu-button" onClick={toggleMenu}>Войти</button>

      <div className={`overlay ${isMenuOpen ? 'active' : ''}`} onClick={closeMenu}></div>

      {isMenuOpen && (
        <div className="menu-login">
          <button className="close-button" onClick={closeMenu}>×</button>

          {isRegistering ? (
            <MenuRegister
              setIsRegistering={setIsRegistering}
              setIsMenuOpen={setIsMenuOpen}
              handleLogin={handleLogin}
            />
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
