import React, { useState, useEffect } from "react";
import "./MenuDropdown.css";

function MenuDropdown({ role, id, setIsMenuOpen }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    setIsMenuOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
    setIsMenuOpen(false);
  };

  const renderMenuItems = () => {
    if (role === "admin") {
      return (
        <>
          <li><a href="/">Все посты</a></li>
          <li><a href="/timeline">Таймлайн</a></li>
          <li><a href="/create_new_tag">Добавить теги</a></li>
          <li><a href="/create_new_editor">Добавить редакторов</a></li>
          <li><a href="/create_post">Добавить пост</a></li>
          <li><a href="/my_posts">Мои посты</a></li>
          <li><a href="/approve_posts">Одобрение постов</a></li>
          <li><a href={`/user/${id}`}>Мой профиль</a></li>
        </>
      );
    }
    if (role === "poster") {
      return (
        <>
          <li><a href="/">Все посты</a></li>
          <li><a href="/timeline">Таймлайн</a></li>
          <li><a href="/create_post">Добавить пост</a></li>
          <li><a href="/my_posts">Мои посты</a></li>
          <li><a href="/approve_posts">Одобрение постов</a></li>
          <li><a href={`/user/${id}`}>Мой профиль</a></li>
        </>
      );
    }
    if (role === "user") {
      return (
        <>
          <li><a href="/">Все посты</a></li>
          <li><a href="/timeline">Таймлайн</a></li>
          <li><a href="/create_post">Добавить пост</a></li>
          <li><a href="/my_posts">Мои посты</a></li>
          <li><a href={`/user/${id}`}>Мой профиль</a></li>
        </>
      );
    }
    return (
      <>
        <li><a href="/">Все посты</a></li>
        <li><a href="/timeline">Таймлайн</a></li>
      </>
    );
  };

  const headerHeight = 115;

  return (
    <div>
      <button className="menu-button" onClick={toggleMenu}>
        Меню
      </button>

      {isOpen && (
        <div
          className="menu-dropdown-overlay"
          onClick={closeMenu}
          style={{ top: `${headerHeight}px`, height: `calc(100vh - ${headerHeight}px)` }}
        ></div>
      )}

      <div
        className={`side-menu ${isOpen ? "open" : ""}`}
        style={{
          top: `${headerHeight}px`,
          height: `calc(100vh - ${headerHeight}px)`,
        }}
      >
        <h2>Меню</h2>
        <ul className="menu-items">{renderMenuItems()}</ul>
      </div>
    </div>
  );
}

export default MenuDropdown;