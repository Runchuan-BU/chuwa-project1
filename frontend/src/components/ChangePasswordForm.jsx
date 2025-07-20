import { useState } from 'react';
import client from '../api/client';

export default function ChangePasswordForm() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await client.post('/auth/change-password', {
        oldPassword,
        newPassword,
      });
      alert('Password updated successfully');
      setOldPassword('');
      setNewPassword('');
    } catch (err) {
      alert('Failed to change password');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-10 p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Change Password</h2>
      <input
        type="password"
        value={oldPassword}
        onChange={(e) => setOldPassword(e.target.value)}
        placeholder="Current Password"
        className="w-full p-2 mb-3 border rounded"
        required
      />
      <input
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        placeholder="New Password"
        className="w-full p-2 mb-4 border rounded"
        required
      />
      <button type="submit" className="w-full bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600">
        Update Password
      </button>
    </form>
  );
}
