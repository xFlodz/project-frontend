import { useState } from "react";
import { logoutUser } from "../../services/apiUser";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

function LogoutButton({ setIsMenuOpen, setIsLoggedIn }) {
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logoutUser();
      setIsLoggedIn(false);
      setIsMenuOpen(false);
      window.location.reload();
    } catch (error) {
      console.error("Ошибка при выходе:", error.response?.data || error.message);
    } finally {
      setLoading(false);
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
