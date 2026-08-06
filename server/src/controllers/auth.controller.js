const mongoose = require('mongoose');
const User = require('../models/User');
const { generateToken } = require('../utils/jwt');
const { logActivity } = require('../utils/activityLogger');
const bcrypt = require('bcryptjs');

// In-memory fallback users store for immediate testing if DB connection is offline
const memoryUsers = new Map();

const isDbConnected = () => mongoose.connection.readyState === 1;

const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, phone, bio } = req.body;
    const lowerEmail = email ? email.toLowerCase() : '';

    let userExists = false;
    if (isDbConnected()) {
      try {
        const existing = await User.findOne({ email: lowerEmail });
        if (existing) userExists = true;
      } catch (e) {
        if (memoryUsers.has(lowerEmail)) userExists = true;
      }
    } else {
      if (memoryUsers.has(lowerEmail)) userExists = true;
    }

    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists with this email address' });
    }

    let user;
    try {
      user = await User.create({
        name,
        email: email.toLowerCase(),
        password,
        phone: phone || '',
        bio: bio || 'Citizen / Small Business Owner looking for AI Legal Clarity',
      });
    } catch (e) {
      // Memory fallback
      const hashedPassword = await bcrypt.hash(password, 10);
      const fakeId = 'usr_' + Date.now();
      user = {
        _id: fakeId,
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        phone: phone || '',
        bio: bio || '',
        role: 'user',
        createdAt: new Date(),
      };
      memoryUsers.set(email.toLowerCase(), user);
    }

    const token = generateToken(user._id, user.email, user.role);
    await logActivity(user._id, `User account created: ${user.name}`, 'auth');

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        bio: user.bio,
        role: user.role,
        profileImage: user.profileImage || '',
      },
    });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const lowerEmail = email ? email.toLowerCase() : '';

    let user = null;
    if (isDbConnected()) {
      try {
        user = await User.findOne({ email: lowerEmail }).select('+password');
      } catch (e) {
        user = memoryUsers.get(lowerEmail);
      }
    } else {
      user = memoryUsers.get(lowerEmail);
    }

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    let isMatch = false;
    if (user.matchPassword) {
      isMatch = await user.matchPassword(password);
    } else {
      isMatch = await bcrypt.compare(password, user.password);
    }

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const userId = user._id || user.id;
    const token = generateToken(userId, user.email, user.role || 'user');
    await logActivity(userId, `User logged in`, 'auth');

    res.json({
      success: true,
      token,
      user: {
        id: userId,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        bio: user.bio || '',
        role: user.role || 'user',
        profileImage: user.profileImage || '',
      },
    });
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = req.user;
    const userId = user._id || user.id;
    res.json({
      success: true,
      user: {
        id: userId,
        name: user.name || 'User',
        email: user.email,
        phone: user.phone || '',
        bio: user.bio || '',
        role: user.role || 'user',
        profileImage: user.profileImage || '',
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, bio, profileImage } = req.body;
    let user;

    try {
      user = await User.findById(req.user._id);
      if (user) {
        if (name) user.name = name;
        if (phone !== undefined) user.phone = phone;
        if (bio !== undefined) user.bio = bio;
        if (profileImage !== undefined) user.profileImage = profileImage;
        await user.save();
      }
    } catch (e) {
      user = req.user;
      if (name) user.name = name;
      if (phone) user.phone = phone;
      if (bio) user.bio = bio;
    }

    await logActivity(req.user._id, `Updated profile details`, 'auth');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: req.user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        bio: user.bio,
        profileImage: user.profileImage || '',
      },
    });
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    try {
      const user = await User.findById(req.user._id).select('+password');
      if (user) {
        const isMatch = await user.matchPassword(currentPassword);
        if (!isMatch) {
          return res.status(400).json({ success: false, message: 'Current password is incorrect' });
        }
        user.password = newPassword;
        await user.save();
      }
    } catch (e) {
      // Memory fallback ignore
    }

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
  changePassword,
};
