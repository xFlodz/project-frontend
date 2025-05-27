import { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { changePassword } from "../../services/apiUser";
import "./ModalChangePassword.css";

function ModalChangePassword({ onClose, onSave }) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(""); 
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!oldPassword) errs.oldPassword = "Введите старый пароль";
    if (!newPassword) errs.newPassword = "Введите новый пароль";
    if (newPassword !== confirmNewPassword) errs.confirmNewPassword = "Пароли не совпадают";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSaveClick = async () => {
    setApiError("");
    if (validate()) {
      setLoading(true);
      try {
        const response = await changePassword({ old_password: oldPassword, new_password: newPassword });
        if (onSave) onSave(response);
        onClose();
      } catch (error) {
        setApiError(error.message || "Ошибка при смене пароля");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>&times;</button>
        <h2 className="modal-header">Изменить пароль</h2>
        <div className="modal-body">
          <div className="form-group">
            <label>Введите старый пароль</label>
            <div className="password-input">
              <input
                type={showOldPass ? "text" : "password"}
                value={oldPassword}
                onChange={e => setOldPassword(e.target.value)}
              />
              <span
                className="toggle-password"
                onClick={() => setShowOldPass(!showOldPass)}
              >
                {showOldPass ? <AiFillEyeInvisible /> : <AiFillEye />}
              </span>
            </div>
            {errors.oldPassword && <p className="error-message">{errors.oldPassword}</p>}
          </div>

          <div className="form-group">
            <label>Новый пароль</label>
            <div className="password-input">
              <input
                type={showNewPass ? "text" : "password"}
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
              />
              <span
                className="toggle-password"
                onClick={() => setShowNewPass(!showNewPass)}
              >
                {showNewPass ? <AiFillEyeInvisible /> : <AiFillEye />}
              </span>
            </div>
            {errors.newPassword && <p className="error-message">{errors.newPassword}</p>}
          </div>

          <div className="form-group">
            <label>Подтвердите новый пароль</label>
            <div className="password-input">
              <input
                type={showConfirmPass ? "text" : "password"}
                value={confirmNewPassword}
                onChange={e => setConfirmNewPassword(e.target.value)}
              />
              <span
                className="toggle-password"
                onClick={() => setShowConfirmPass(!showConfirmPass)}
              >
                {showConfirmPass ? <AiFillEyeInvisible /> : <AiFillEye />}
              </span>
            </div>
            {errors.confirmNewPassword && <p className="error-message">{errors.confirmNewPassword}</p>}
          </div>

          {apiError && <p className="error-message api-error">{apiError}</p>}
        </div>

        <div className="modal-footer">
          <button onClick={handleSaveClick} disabled={loading}>
            {loading ? "Сохраняем..." : "Сохранить"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalChangePassword;
