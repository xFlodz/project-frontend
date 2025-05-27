import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserById, updateProfile } from "../../services/apiUser";
import ModalChangePassword from "../../components/ModalChangePassword/ModalChangePassword";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import "./ProfilePage.css";

function ProfilePage() {
  const { id } = useParams();
  const [userData, setUserData] = useState(null);
  const [editableData, setEditableData] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const getRoleDisplay = (role) => {
    switch (role) {
      case "admin":
        return "Администратор";
      case "poster":
        return "Редактор";
      case "user":
      default:
        return "Пользователь";
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUserById(id);
        setUserData(data);
        setEditableData({ ...data });
        setIsOwner(localStorage.getItem("id") === data.id.toString());
      } catch (error) {
        console.error("Ошибка при получении пользователя:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    setEditableData({ ...editableData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await updateProfile(editableData);
      setUserData(editableData);
    } catch (error) {
      console.error("Ошибка при сохранении профиля:", error);
    }
  };

  const handlePasswordChange = (formData) => {
    console.log("Изменение пароля:", formData);
    setShowModal(false);
  };

  if (loading) return <LoadingSpinner />;
  if (!userData) return <div className="profile-container">Пользователь не найден</div>;

  return (
    <div className="profile-container">
      <h2>Профиль пользователя</h2>
      <div className="profile-info">
        <p>{getRoleDisplay(userData.role)}</p>

        <label>Имя:</label>
        {isOwner ? (
          <input
            type="text"
            name="name"
            value={editableData?.name || ""}
            onChange={handleChange}
          />
        ) : (
          <p>{userData.name}</p>
        )}

        <label>Фамилия:</label>
        {isOwner ? (
          <input
            type="text"
            name="surname"
            value={editableData?.surname || ""}
            onChange={handleChange}
          />
        ) : (
          <p>{userData.surname}</p>
        )}

        <label>Email:</label>
        {isOwner ? (
          <input
            type="email"
            name="email"
            value={editableData?.email || ""}
            onChange={handleChange}
          />
        ) : (
          <p>{userData.email}</p>
        )}

        {isOwner && (
          <div className="button-group">
            <button className="profile-button" onClick={handleSave}>
              Сохранить
            </button>
            <button
              className="profile-button secondary"
              onClick={() => setShowModal(true)}
            >
              Изменить пароль
            </button>
          </div>
        )}
      </div>

      {showModal && (
        <ModalChangePassword
          onClose={() => setShowModal(false)}
          onSave={handlePasswordChange}
        />
      )}
    </div>
  );
}

export default ProfilePage;
