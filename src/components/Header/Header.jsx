import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import miigaikLogo from "../../assets/logo.png";
import './Header.css';
import MenuDropdown from "../MenuDropdown/MenuDropdown";
import MenuLogin from "../MenuLogin/MenuLogin";
import LogoutButton from "../LogoutButton/LogoutButton";
import { loginUser } from "../../services/apiUser";
import Notification from "../Notification/Notification";

function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [notification, setNotification] = useState({ message: "", type: "" });

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      setIsLoggedIn(true);
    }

    const handleScroll = () => {
      if (!isMenuOpen) {
        setIsScrolled(window.scrollY > 50);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMenuOpen]);

const handleLogin = async (userData) => {
  try {
    const response = await loginUser(userData);

    if (response.access_token) {
      setIsLoggedIn(true);
      return { success: true };
    } else {
      return { success: false, message: "Неверный логин или пароль" };
    }
  } catch (error) {
    return { success: false, message: error.message || "Ошибка входа" };
  }
};

  return (
    <div className={`header-container ${isScrolled && !isMenuOpen ? "scrolled" : ""}`}>
      <div className="left-components">
      </div>
      <div className="middle-components">
        <a href="/">
          <img src={miigaikLogo} alt="React Logo" />
        </a>
      </div>
      <div className="right-components">
        {isLoggedIn ? (
          <LogoutButton setIsMenuOpen={setIsMenuOpen} setIsLoggedIn={setIsLoggedIn} />
        ) : (
          <MenuLogin
            setIsMenuOpen={setIsMenuOpen}
            handleLogin={handleLogin}
            setNotification={setNotification}
          />
        )}
        <MenuDropdown role={localStorage.getItem('role')} id={localStorage.getItem('id')} setIsMenuOpen={setIsMenuOpen} />
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification({ message: '', type: '' })}
        />
      </div>
    </div>
  );
}

export default Header;