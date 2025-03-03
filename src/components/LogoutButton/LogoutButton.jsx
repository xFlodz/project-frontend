import { useState } from "react";
import { logoutUser } from "../../services/apiUser";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

function LogoutButton({ setIsMenuOpen, setIsLoggedIn }) {
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true); // Пока выполняется выход, показываем загрузку
    try {
      await logoutUser(); // Выход из системы
      setIsLoggedIn(false); // Обновляем состояние авторизации
      setIsMenuOpen(false); // Закрываем меню после выхода
    } catch (error) {
      console.error("Ошибка при выходе:", error.response?.data || error.message);
    } finally {
      setLoading(false); // Снимаем состояние загрузки
    }
  };

  return (
    <button className="menu-button" onClick={handleLogout} disabled={loading}>
      Выйти
      {loading && <LoadingSpinner />}
    </button>
  );
}

export default LogoutButton;
