import React, { useState, useEffect } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import MenuRegister from "../MenuRegister/MenuRegister";
import { useNavigate } from "react-router-dom";
import "./MenuLogin.css";

function MenuLogin({ setIsMenuOpen, handleLogin, setNotification }) {
  const [isMenuOpenLocal, setIsMenuOpenLocal] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const overlay = document.querySelector(".overlay");
    const menuLogin = document.querySelector(".menu-login");

    if (isMenuOpenLocal) {
      document.body.style.overflow = "hidden";

      const headerHeight = 115;
      overlay.style.top = `${headerHeight}px`;
      overlay.style.height = `calc(100vh - ${headerHeight}px)`;
      menuLogin.style.top = `${headerHeight + 60}px`;
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMenuOpenLocal]);

  const toggleMenu = () => {
    setIsMenuOpenLocal(!isMenuOpenLocal);
    setIsMenuOpen(!isMenuOpenLocal);
  };

  const closeMenu = () => {
    setIsMenuOpenLocal(false);
    setIsMenuOpen(false);
    setLogin("");
    setPassword("");
    setError("");
    setIsRegistering(false);
    setShowPassword(false);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const result = await handleLogin({ login, password });

    if (result.success) {
      setIsMenuOpenLocal(false);
      setNotification({ message: "Вы успешно вошли.", type: "success" });
      navigate("/");
    } else {
      setError(result.message || "Ошибка при входе.");
    }
  };

  return (
    <div>
      <button className="menu-button" onClick={toggleMenu}>
        Войти
      </button>

      <div className={`overlay ${isMenuOpenLocal ? "active" : ""}`} onClick={closeMenu}></div>

      {isMenuOpenLocal && (
        <div className="menu-login">
          <button className="close-button" onClick={closeMenu}>
            &times;
          </button>

          {isRegistering ? (
            <MenuRegister
              setIsRegistering={setIsRegistering}
              closeMenu={closeMenu}
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
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="Введите пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <span
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                    role="button"
                    aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") setShowPassword(!showPassword);
                    }}
                  >
                    {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                  </span>
                </div>
                <button type="submit">Войти</button>
              </form>
              {error && <p className="error-message">{error}</p>}
              <span
                className="register-link"
                onClick={() => {
                  setIsRegistering(true);
                  setLogin("");
                  setPassword("");
                  setError("");
                }}
              >
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
