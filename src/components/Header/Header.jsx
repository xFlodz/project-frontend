import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import miigaikLogo from "../../assets/logo.png";
import miigaik245 from "../../assets/miigaik245.png";
import './Header.css';
import MenuDropdown from "../MenuDropdown/MenuDropdown";
import MenuLogin from "../MenuLogin/MenuLogin";
import LogoutButton from "../LogoutButton/LogoutButton";
import { loginUser } from "../../services/apiUser";

function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Состояние для открытия меню
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      setIsLoggedIn(true);
    }

    const handleScroll = () => {
      if (!isMenuOpen) { // Обновляем isScrolled только если меню закрыто
        setIsScrolled(window.scrollY > 50);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMenuOpen]); // Зависимость от isMenuOpen

  const handleLogin = async (userData) => {
    try {
      await loginUser(userData);
      setIsLoggedIn(true);
    } catch (error) {
      console.error('Ошибка при входе:', error.response?.data || error.message);
    }
  };

  return (
    <div className={`header-container ${isScrolled && !isMenuOpen ? "scrolled" : ""}`}>
      <div className="left-components">
        <Link to="/">
          <img src={miigaik245} alt="React Logo" />
        </Link>
      </div>
      <div className="middle-components">
        <Link to="/">
          <img src={miigaikLogo} alt="React Logo" />
        </Link>
      </div>
      <div className="right-components">
        {isLoggedIn ? (
          <LogoutButton setIsMenuOpen={setIsMenuOpen} setIsLoggedIn={setIsLoggedIn} />
        ) : (
          <MenuLogin handleLogin={handleLogin} setIsMenuOpen={setIsMenuOpen} />
        )}
        <MenuDropdown role={localStorage.getItem('role')} setIsMenuOpen={setIsMenuOpen} />
      </div>
    </div>
  );
}

export default Header;