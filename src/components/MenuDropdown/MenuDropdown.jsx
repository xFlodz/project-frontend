import React, { useState, useEffect } from "react";
import "./MenuDropdown.css";

function MenuDropdown({ role }) { // Принимаем роль как пропс
  const [isOpen, setIsOpen] = useState(false);

  const disableScroll = () => {
    document.body.style.overflow = 'hidden';
  };

  const enableScroll = () => {
    document.body.style.overflow = 'auto';
  };

  useEffect(() => {
    if (isOpen) {
      disableScroll();
      document.querySelector('.header-container').classList.add('scrolled');
    } else {
      enableScroll();
      document.querySelector('.header-container').classList.remove('scrolled');
    }

    return () => {
      enableScroll();
    };
  }, [isOpen]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const renderMenuItems = () => {
    console.log(role);
    if (role === 'admin') {
      return (
        <>
          <li><a href="/">Все посты</a></li>
          <li><a href="/create_new_tag">Добавить теги</a></li>
          <li><a href="/create_new_editor">Добавить редакторов</a></li>
          <li><a href="/create_post">Добавить пост</a></li>
          <li><a href="/my_posts">Мои посты</a></li>
          <li><a href="/approve_posts">Одобрение постов</a></li>
        </>
      );
    }

    if (role === 'poster') {
      return (
        <>
          <li><a href="/">Все посты</a></li>
          <li><a href="/create_post">Добавить пост</a></li>
          <li><a href="/my_posts">Мои посты</a></li>
          <li><a href="/approve_posts">Одобрение постов</a></li>
        </>
      );
    }

    if (role === 'user') {
      return (
        <>
          <li><a href="/">Все посты</a></li>
          <li><a href="/create_post">Добавить пост</a></li>
          <li><a href="/my_posts">Мои посты</a></li>
        </>
      );
    }
    return (
      <li><a href="/">Все посты</a></li>
    );
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
          {renderMenuItems()}
        </ul>
      </div>
    </div>
  );
}

export default MenuDropdown;