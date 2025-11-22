const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  getUsers,
  updateUser,
  deleteUser
} = require('../controllers/userController');
const { auth, adminAuth } = require('../middlewares/auth');

// TEMPORARY: GET route for testing in browser
router.get('/register', (req, res) => {
  res.json({ 
    message: 'This is a GET test. To register a user, use POST method with:',
    example: {
      username: "admin",
      email: "admin@pharmacy.com", 
      password: "admin123",
      role: "admin"
    }
  });
});

// Actual POST route for user registration
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', auth, getUserProfile);
router.get('/', auth, adminAuth, getUsers);
router.put('/:id', auth, adminAuth, updateUser);
router.delete('/:id', auth, adminAuth, deleteUser);

module.exports = router;