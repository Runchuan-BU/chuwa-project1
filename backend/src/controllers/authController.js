// pull data form user model 
//amd link with route/auth.js

import User from '../models/user.js';
import jwt from 'jsonwebtoken';

import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

function generateToken(user) {
  return jwt.sign(
    { id: user._id, role: user.role, username: user.username }, //playload
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

export const signUp = async (req, res) => {

  try {
    const { username, email, password, role } = req.body;
    // validation in middleware 

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'Email already in use' });

    const user = new User({ username, email, password, role });
    await user.save();

    const token = generateToken(user);
    res.status(201).json({ token, user: { id: user._id, username, email, role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid email or password' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });

    const token = generateToken(user);
    res.json({ token, user: { id: user._id, username: user.username, email: user.email, role: user.role } });
  } catch (err) {
    console.error('Login error:', err); // helpful for debugging
    res.status(500).json({ message: err.message });
  }
};

export const logout = (req, res) => {
  // !!!JWT 無狀態，前端刪除 token 即可，後端通常不需特別處理
  res.json({ message: 'Logged out' });
};

export const updatePassword = async (req, res) => {
  try {
    const userId = req.user.id; // 從驗證 middleware 取得
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) return res.status(401).json({ message: 'Old password incorrect' });

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};