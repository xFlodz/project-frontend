import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import reactLogo from "../../assets/react.svg";
import './Header.css';
import MenuDropdown from "../MenuDropdown/MenuDropdown";
import MenuLogin from "../MenuLogin/MenuLogin";
import LogoutButton from "../LogoutButton/LogoutButton";
import { loginUser } from "../../services/apiUser";

function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Состояние для отслеживания открытого меню
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Состояние для проверки авторизации

  const handleScroll = () => {
    if (window.scrollY > 50) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };

  // Проверяем токен в localStorage при монтировании компонента
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      setIsLoggedIn(true); // Если токен есть, считаем, что пользователь авторизован
    }
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Функция для входа пользователя
  const handleLogin = async (userData) => {
    try {
      await loginUser(userData); // Выполняем вход
      setIsLoggedIn(true); // Обновляем состояние после успешного входа
    } catch (error) {
      console.error('Ошибка при входе:', error.response?.data || error.message);
    }
  };

  return (
    <div className={`header-container ${isScrolled || isMenuOpen ? "scrolled" : ""}`}>
      <div className="left-components">
        <Link to="/">
          <img src={reactLogo} alt="React Logo" />
        </Link>
      </div>
      <div className="middle-components">
        <Link to="/">
          <img src={reactLogo} alt="React Logo" />
        </Link>
      </div>
      <div className="right-components">
        {isLoggedIn ? (
          <LogoutButton setIsMenuOpen={setIsMenuOpen} setIsLoggedIn={setIsLoggedIn} />
        ) : (
          <MenuLogin handleLogin={handleLogin} setIsMenuOpen={setIsMenuOpen} />
        )}
        <MenuDropdown />
      </div>
    </div>
  );
}

export default Header;
