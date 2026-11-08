const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { logAudit } = require('../utils/auditLogger');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'inkloom_guard_super_secret_jwt_key_2026', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role, organization, department } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    const assignedRole = ['creator', 'reviewer', 'manager'].includes(role) ? role : 'creator';

    const user = await User.create({
      name,
      email,
      password,
      role: assignedRole,
      organization: organization || 'FreshPlus Global',
      department: department || 'Brand Marketing'
    });

    const token = generateToken(user._id);

    // Asynchronously log audit event without blocking client registration response
    logAudit({
      user,
      role: user.role,
      action: 'USER_REGISTERED',
      targetResource: 'User',
      targetId: user._id,
      details: { email: user.email, role: user.role }
    }).catch((err) => {
      console.error('[Audit Log Error in Register]', err.message);
    });

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        organization: user.organization,
        department: user.department
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = generateToken(user._id);

    // Asynchronously log audit event without blocking client login response
    logAudit({
      user,
      role: user.role,
      action: 'USER_LOGIN',
      targetResource: 'User',
      targetId: user._id,
      details: { email: user.email, role: user.role }
    }).catch((err) => {
      console.error('[Audit Log Error in Login]', err.message);
    });

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        organization: user.organization,
        department: user.department
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        organization: user.organization,
        department: user.department
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users (Manager only)
// @route   GET /api/users
// @access  Private/Manager
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, users });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user role (Manager only)
// @route   PATCH /api/users/:id/role
// @access  Private/Manager
const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!['creator', 'reviewer', 'manager'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    await logAudit({
      user: req.user,
      role: req.user.role,
      action: 'UPDATE_USER_ROLE',
      targetResource: 'User',
      targetId: user._id,
      details: { targetEmail: user.email, newRole: role }
    });

    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  getUsers,
  updateUserRole
};
