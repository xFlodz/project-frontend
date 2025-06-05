import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getUserById, updateProfile, changeRole, deleteUser } from "../../services/apiUser";
import { getUserPosts } from "../../services/apiPost";
import ModalChangePassword from "../../components/ModalChangePassword/ModalChangePassword";
import Notification from "../../components/Notification/Notification";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import RenderField from "../../components/RenderField/RenderField";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";
import "./ProfilePage.css";

function ProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [userData, setUserData] = useState(null);
  const [editableData, setEditableData] = useState(null);
  const [newImageFile, setNewImageFile] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userPosts, setUserPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [showModal, setShowModal] = useState(false);
  const fileInputRef = useRef(null);

  const getRoleDisplay = (role) => {
    switch (role) {
      case "admin":
        return "Администратор";
      case "poster":
        return "Редактор";
      case "user":
      default:
        return "Автор";
    }
  };

  const fetchUserPosts = async () => {
    try {
      setPostsLoading(true);
      const posts = await getUserPosts(id);
      
      setUserPosts(posts);
    } catch (error) {
      console.error("Ошибка при получении постов пользователя:", error);
    } finally {
      setPostsLoading(false);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUserById(id);
        setUserData(data);
        setEditableData({ ...data });
        const currentUserId = localStorage.getItem("id");
        const currentUserRole = localStorage.getItem("role");
        setIsOwner(currentUserId === data.id.toString());
        setIsAdmin(currentUserRole === "admin");

        if (!data.is_approved && currentUserRole !== "admin") {
          navigate("/", { replace: true });
        }

        await fetchUserPosts();
      } catch (error) {
        console.error("Ошибка при получении пользователя:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const isAdminButNotOwner = isAdmin && !isOwner;

  const validateFields = () => {
    const nameRegex = /^[А-Яа-яA-Za-z\- ]+$/;
    const phoneRegex = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;
    const telegramRegex = /^@[\w\d_]{3,}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const {
      name = "",
      surname = "",
      thirdname = "",
      phone = "",
      telegram_id = "",
      email = "",
    } = editableData || {};

    if (!name.trim() || !nameRegex.test(name))
      return "Имя может содержать только буквы, пробелы и дефис.";
    if (!surname.trim() || !nameRegex.test(surname))
      return "Фамилия может содержать только буквы, пробелы и дефис.";
    if (thirdname && thirdname.trim() && !nameRegex.test(thirdname))
      return "Отчество может содержать только буквы, пробелы и дефис.";
    if (phone && phone.trim() && !phoneRegex.test(phone))
      return "Телефон должен быть в формате +7 (XXX) XXX-XX-XX.";
    if (telegram_id && telegram_id.trim() && !telegramRegex.test(telegram_id))
      return "ID Telegram должен начинаться с @ и содержать буквы, цифры или подчеркивания.";
    if (!email.trim() || !emailRegex.test(email))
      return "Введите корректный email.";

    return null;
  };

  const handleDeleteUser = async () => {
    setShowDeleteModal(true);
  };

  const confirmDeleteUser = async () => {
    try {
      await deleteUser(userData.id);
      navigate('/authors');
      setNotification({ 
        message: "Пользователь успешно удален", 
        type: "success" 
      });
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Ошибка при удалении пользователя:", error);
      setNotification({ 
        message: "Не удалось удалить пользователя", 
        type: "error" 
      });
      setShowDeleteModal(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditableData((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangeRole = async (newRole) => {
    try {
      await changeRole(userData.id, newRole);
      setUserData({ ...userData, role: newRole });
      setNotification({ 
        message: `Роль пользователя успешно изменена на "${getRoleDisplay(newRole)}"`, 
        type: "success" 
      });
    } catch (error) {
      console.error("Ошибка при изменении роли:", error);
      setNotification({ 
        message: "Не удалось изменить роль пользователя", 
        type: "error" 
      });
    }
  };

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleSave = async () => {
    const error = validateFields();
    if (error) {
      setNotification({ message: error, type: "error" });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("id", editableData.id);
      formData.append("name", editableData.name);
      formData.append("surname", editableData.surname);
      formData.append("thirdname", editableData.thirdname || "");
      formData.append("email", editableData.email);
      formData.append("phone", editableData.phone || "");
      formData.append("telegram_id", editableData.telegram_id || "");
      if (newImageFile) {
        formData.append("image", newImageFile);
      }

      await updateProfile(formData);

      setUserData({ ...editableData });
      setNewImageFile(null);
      setNotification({ message: "Информация успешно обновлена!", type: "success" });
    } catch (error) {
      console.error("Ошибка при сохранении профиля:", error);
      setNotification({ message: "Ошибка при изменении профиля!", type: "error" });
    }
  };

  const handlePasswordChange = (formData) => {
    console.log("Изменение пароля:", formData);
    setShowModal(false);
  };

  if (loading) return <LoadingSpinner />;
  if (!userData) return <div className="profile-container">Пользователь не найден</div>;

  const sharedProps = {
    isOwner,
    isAdminButNotOwner,
    editableData,
    userData,
    handleChange,
  };

  return (
    <div className="profile-page-wrapper">
    <div className="profile-container">
      <h2>Профиль пользователя</h2>

      <div className="profile-image-wrapper">
        <div className="profile-image">
          {imagePreview || editableData?.image ? (
            <img
              src={
                imagePreview
                  ? imagePreview
                  : `http://localhost:5001/api/photo/${editableData.image}`
              }
              alt="Аватар пользователя"
            />
          ) : (
            <div className="placeholder-image">Нет изображения</div>
          )}
        </div>
        {(isOwner) && (
          <>
            <button className="change-image-button" onClick={handleImageClick}>
              Изменить изображение
            </button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleImageChange}
            />
          </>
        )}
      </div>

      <div className="profile-main">
        <div className="profile-info">
          <p><b>Роль:</b> {getRoleDisplay(userData.role)}</p>

          {(isOwner) ? (
            <>
              <RenderField label="Имя" name="name" required {...sharedProps} />
              <RenderField label="Фамилия" name="surname" required {...sharedProps} />
              <RenderField label="Отчество" name="thirdname" {...sharedProps} />
            </>
          ) : (
            <p><b>ФИО:</b> {`${userData.surname} ${userData.name}${userData.thirdname ? ' ' + userData.thirdname : ''}`}</p>
          )}
          {(isOwner) && (
            <>
              <RenderField label="Email" name="email" type="email" required {...sharedProps} />
              <RenderField label="Телефон" name="phone" {...sharedProps} />
              <RenderField label="Telegram ID" name="telegram_id" {...sharedProps} />
            </>
          )}

          {isAdminButNotOwner && (
            <>
              <RenderField label="Email" name="email" type="email" required {...sharedProps} />
              <RenderField label="Телефон" name="phone" {...sharedProps} />
              <RenderField label="Telegram ID" name="telegram_id" {...sharedProps} />
            </>
          )}

          {isOwner && (
            <div className="button-group">
              <button className="profile-button" onClick={handleSave}>Сохранить</button>
              <button className="profile-button secondary" onClick={() => setShowModal(true)}>Изменить пароль</button>
            </div>
          )}

          {isAdmin && !isOwner && (
            <div className="role-buttons">
              {userData.role === 'user' && (
                <div className="horizontal-buttons">
                  <button 
                    className="make-poster-button"
                    onClick={() => handleChangeRole('poster')}
                  >
                    Повысить до редактора
                  </button>
                  <button 
                    className="delete-user-button"
                    onClick={handleDeleteUser}
                  >
                    Удалить пользователя
                  </button>
                </div>
              )}
              {userData.role === 'poster' && (
                <div className="horizontal-buttons">
                  <button 
                    className="make-user-button"
                    onClick={() => handleChangeRole('user')}
                  >
                    Понизить до автора
                  </button>
                  <button 
                    className="delete-user-button"
                    onClick={handleDeleteUser}
                  >
                    Удалить пользователя
                  </button>
                </div>
              )}
            </div>
          )}
          
        </div>
      </div>
      </div>

      <div className="user-posts-section">
          <h3>Посты пользователя</h3>
          
          {postsLoading ? (
            <LoadingSpinner />
          ) : userPosts.length === 0 ? (
            <p>Пользователь еще не создал ни одного поста</p>
          ) : (
            <div className="user-posts-grid">
              {userPosts.map((post) => (
                <Link 
                  to={`/post/${post.address}`} 
                  key={post.id}
                  className="user-post-card"
                >
                  <div className="post-info">
                    <h4>{post.header}</h4>
                    <p className="post-description">
                      {post.lead}
                    </p>
                    <p className="post-date">
                      {new Date(post.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

      {showModal && (
        <ModalChangePassword
          onClose={() => setShowModal(false)}
          onSave={handlePasswordChange}
        />
      )}
      <ConfirmModal
        isOpen={showDeleteModal}
        message="Вы уверены, что хотите удалить этого пользователя?"
        onConfirm={confirmDeleteUser}
        onCancel={() => setShowDeleteModal(false)}
      />
      <Notification
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ message: "", type: "" })}
      />
    </div>
  );
}

export default ProfilePage;
