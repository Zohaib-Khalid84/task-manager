import { useState } from 'react';
import api from '../api';

export default function Profile({ user, tasks, onUserUpdate }) {
  const [name, setName] = useState(user.name);
  const [nameMsg, setNameMsg] = useState({ type: '', text: '' });

  const [pw, setPw] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [pwMsg, setPwMsg] = useState({ type: '', text: '' });

  const total = tasks.length;
  const done = tasks.filter((t) => t.completed).length;
  const percent = total ? Math.round((done / total) * 100) : 0;

  const saveName = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.put('/profile', { name });
      onUserUpdate(data);
      setNameMsg({ type: 'ok', text: 'Name updated successfully' });
    } catch (err) {
      setNameMsg({ type: 'err', text: err.response?.data?.message || 'Could not update name' });
    }
  };

  const savePassword = async (e) => {
    e.preventDefault();
    if (pw.newPassword !== pw.confirm) {
      return setPwMsg({ type: 'err', text: 'New passwords do not match' });
    }
    try {
      const { data } = await api.put('/profile/password', {
        currentPassword: pw.currentPassword,
        newPassword: pw.newPassword,
      });
      setPwMsg({ type: 'ok', text: data.message });
      setPw({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (err) {
      setPwMsg({ type: 'err', text: err.response?.data?.message || 'Could not change password' });
    }
  };

  return (
    <>
      <div className="panel profile-head">
        <div className="avatar big">{user.name.charAt(0).toUpperCase()}</div>
        <div>
          <h2>{user.name}</h2>
          <p className="muted">{user.email}</p>
        </div>
        <div className="profile-stats">
          <div><strong>{total}</strong><span>Tasks</span></div>
          <div><strong>{done}</strong><span>Done</span></div>
          <div><strong>{percent}%</strong><span>Complete</span></div>
        </div>
      </div>

      <div className="grid-2">
        <form className="panel" onSubmit={saveName}>
          <h3>Edit Profile</h3>
          <label>Full Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} />
          <label>Email</label>
          <input value={user.email} disabled />
          {nameMsg.text && <p className={nameMsg.type === 'ok' ? 'success' : 'error'}>{nameMsg.text}</p>}
          <button type="submit" className="btn-primary" style={{ marginTop: 16 }}>Save Changes</button>
        </form>

        <form className="panel" onSubmit={savePassword}>
          <h3>Change Password</h3>
          <label>Current password</label>
          <input type="password" value={pw.currentPassword}
            onChange={(e) => setPw({ ...pw, currentPassword: e.target.value })} />
          <label>New password</label>
          <input type="password" value={pw.newPassword}
            onChange={(e) => setPw({ ...pw, newPassword: e.target.value })} />
          <label>Confirm new password</label>
          <input type="password" value={pw.confirm}
            onChange={(e) => setPw({ ...pw, confirm: e.target.value })} />
          {pwMsg.text && <p className={pwMsg.type === 'ok' ? 'success' : 'error'}>{pwMsg.text}</p>}
          <button type="submit" className="btn-primary" style={{ marginTop: 16 }}>Update Password</button>
        </form>
      </div>
    </>
  );
}