const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
  updateOnboarding,
  getUsers,
  updateUserRole
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.patch('/onboarding', protect, updateOnboarding);

// Manager user management
router.get('/users', protect, authorize('manager'), getUsers);
router.patch('/users/:id/role', protect, authorize('manager'), updateUserRole);

module.exports = router;
