import React, { useState, useEffect } from "react";
import "./MenuDropdown.css";

function MenuDropdown() {
  const [isOpen, setIsOpen] = useState(false);

  // Функция для отключения прокрутки
  const disableScroll = () => {
    document.body.style.overflow = 'hidden';
  };

  // Функция для включения прокрутки
  const enableScroll = () => {
    document.body.style.overflow = 'auto';
  };

  // Управляем прокруткой и изменением размера хедера при открытии меню
  useEffect(() => {
    if (isOpen) {
      disableScroll();
      document.querySelector('.header-container').classList.add('scrolled');
    } else {
      enableScroll();
      document.querySelector('.header-container').classList.remove('scrolled');
    }

    return () => {
      enableScroll(); // Очистка при размонтировании компонента
    };
  }, [isOpen]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <div>
      <button className="menu-button" onClick={toggleMenu}>
        Меню
      </button>

      <div className={`overlay ${isOpen ? "open" : ""}`} onClick={closeMenu}></div>

      <div className={`side-menu ${isOpen ? "open" : ""}`}>
        <h2>Меню</h2>
        <ul className="menu-items">
          <li><a href="/">Главная</a></li>
          <li><a href="/profile">Профиль</a></li>
          <li><a href="/settings">Настройки</a></li>
        </ul>
      </div>
    </div>
  );
}

export default MenuDropdown;
