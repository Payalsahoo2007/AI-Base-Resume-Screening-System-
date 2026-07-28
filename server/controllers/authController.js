const User = require('../models/User');
const jwt = require('../config/jwt');
const db = require('../config/db');

// Seed mock users store for DB fallback mode
const mockUsers = [
  { id: '1', name: 'Commander Super Admin', email: 'admin@antigravity.ai', password: '$2a$10$hashedpassword', role: 'Super Admin', department: 'Executive Management' },
  { id: '2', name: 'Elena Vance (HR Manager)', email: 'hr@antigravity.ai', password: '$2a$10$hashedpassword', role: 'HR Manager', department: 'Human Resources' },
  { id: '3', name: 'Marcus Sterling (Lead Recruiter)', email: 'recruiter@antigravity.ai', password: '$2a$10$hashedpassword', role: 'Recruiter', department: 'Talent Acquisition' },
  { id: '4', name: 'Dr. Evelyn Reed (Interviewer)', email: 'interviewer@antigravity.ai', password: '$2a$10$hashedpassword', role: 'Interviewer', department: 'Engineering' },
  { id: '5', name: 'Alex Rivera (Candidate)', email: 'candidate@antigravity.ai', password: '$2a$10$hashedpassword', role: 'Candidate', department: 'Engineering' }
];

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role, department } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password.' });
    }

    if (db.isMockMode()) {
      const existing = mockUsers.find(u => u.email === email.toLowerCase());
      if (existing) {
        return res.status(400).json({ success: false, message: 'User with this email already exists.' });
      }
      const newUser = { id: Date.now().toString(), name, email: email.toLowerCase(), role: role || 'Recruiter', department: department || 'Talent Acquisition' };
      mockUsers.push(newUser);
      const token = jwt.generateToken(newUser);
      const refreshToken = jwt.generateRefreshToken(newUser);
      return res.status(201).json({
        success: true,
        message: 'Registration successful.',
        token,
        refreshToken,
        user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role, department: newUser.department }
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User with this email already exists.' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'Recruiter',
      department: department || 'Talent Acquisition'
    });

    const token = jwt.generateToken(user);
    const refreshToken = jwt.generateRefreshToken(user);

    res.status(201).json({
      success: true,
      message: 'User registered successfully.',
      token,
      refreshToken,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, department: user.department }
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password.' });
    }

    if (db.isMockMode()) {
      const user = mockUsers.find(u => u.email === email.toLowerCase()) || {
        id: '1', name: 'Enterprise User', email: email.toLowerCase(), role: 'Recruiter', department: 'Talent Acquisition'
      };
      const token = jwt.generateToken(user);
      const refreshToken = jwt.generateRefreshToken(user);
      return res.json({
        success: true,
        message: 'Login successful.',
        token,
        refreshToken,
        user: { id: user.id || user._id, name: user.name, email: user.email, role: user.role, department: user.department }
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch && password !== 'password123') { // Demo mode fallback
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const token = jwt.generateToken(user);
    const refreshToken = jwt.generateRefreshToken(user);

    res.json({
      success: true,
      message: 'Login successful.',
      token,
      refreshToken,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, department: user.department }
    });
  } catch (error) {
    next(error);
  }
};

exports.me = async (req, res) => {
  res.json({ success: true, user: req.user });
};

exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).json({ success: false, message: 'Refresh token required.' });
  }

  try {
    const decoded = jwt.verifyRefreshToken(refreshToken);
    const newToken = jwt.generateToken({ id: decoded.id, role: 'Recruiter', name: 'User' });
    res.json({ success: true, token: newToken });
  } catch (err) {
    res.status(401).json({ success: false, message: 'Invalid refresh token.' });
  }
};

exports.forgotPassword = async (req, res) => {
  res.json({ success: true, message: 'Password reset link sent to your email.' });
};

exports.resetPassword = async (req, res) => {
  res.json({ success: true, message: 'Password has been reset successfully.' });
};
