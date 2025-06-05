import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllEditors, approveUser } from "../../services/apiUser";
import './AuthorsPage.css';

const AuthorsPage = () => {
  const [approvedUsers, setApprovedUsers] = useState([]);
  const [unapprovedUsers, setUnapprovedUsers] = useState([]);
  const [role, setRole] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedRole = localStorage.getItem('role') || '';
    setRole(storedRole);

    getAllEditors().then((data) => {
      const approved = data.filter(user => user.is_approved);
      const notApproved = data.filter(user => !user.is_approved);

      setApprovedUsers(approved);
      setUnapprovedUsers(notApproved);
    });
  }, []);

  const handleApprove = async (id) => {
    try {
      await approveUser(id);
      const approvedUser = unapprovedUsers.find(u => u.id === id);
      setUnapprovedUsers(prev => prev.filter(u => u.id !== id));
      setApprovedUsers(prev => [...prev, { ...approvedUser, is_approved: true }]);
    } catch (err) {
      alert('Ошибка при одобрении пользователя');
    }
  };

  const getRoleDisplay = (role) => {
    switch (role) {
        case 'admin':
        return 'Администратор';
        case 'poster':
        return 'Редактор';
        case 'user':
        default:
        return 'Автор';
    }
    };

  return (
    <div className="author-page">
      {role === 'admin' && unapprovedUsers.length > 0 && (
        <div className="unapproved-block">
          <h2>Пользователи, ожидающие одобрения</h2>
          {unapprovedUsers.map(user => (
            <div key={user.id}
                className="author-card unapproved"
                onClick={() => navigate(`/user/${user.id}`)}
                role="button"
                tabIndex={0}
            >
            <div className="author-image-wrapper">
                <div className="author-image">
                {user.image ? (
                    <img
                    src={`http://localhost:5001/api/photo/${user.image}`}
                    alt="Аватар пользователя"
                    />
                ) : (
                    <div className="placeholder-image">Нет изображения</div>
                )}
                </div>
            </div>
            <div className="author-info">
                <div>{user.surname} {user.name} {user.thirdname}</div>
                <div className="author-role">{getRoleDisplay(user.role)}</div>
            </div>
            <button
                className="approve-button"
                onClick={(e) => {
                e.stopPropagation();
                handleApprove(user.id);
                }}
            >
                Одобрить
            </button>
            </div>

          ))}
        </div>
      )}

      <h2>Наши авторы</h2>
      <div className="authors-list">
        {approvedUsers.map(user => (
          <div
            key={user.id}
            className="author-card"
            onClick={() => navigate(`/user/${user.id}`)}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => e.key === 'Enter' && navigate(`/profile/${user.id}`)}
          >
            <div className="author-image-wrapper">
              <div className="author-image">
                {user.image ? (
                  <img
                    src={`http://localhost:5001/api/photo/${user.image}`}
                    alt="Аватар пользователя"
                  />
                ) : (
                  <div className="placeholder-image">Нет изображения</div>
                )}
              </div>
            </div>
            <div className="author-info">
              <div>{user.surname} {user.name} {user.thirdname}</div>
              <div className="author-role">{getRoleDisplay(user.role)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AuthorsPage;
