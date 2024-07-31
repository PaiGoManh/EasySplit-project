const express = require('express');
const bcrypt = require('bcrypt');
const multer = require('multer');
const User = require('../models/User');
const { ensureAuthenticated } = require('../middleware/authMiddleware'); 
const fs = require('fs');
const path = require('path');
const router = express.Router();
require('dotenv').config();
const { profileUpload,bannerUpload } = require('../multer')
const app = express()

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'profileBanner') {
      cb(null, 'uploads/');
    } else if (file.fieldname === 'profilePicture') {
      cb(null, 'uploads/');
    }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'profileBanner' || file.fieldname === 'profilePicture') {
      cb(null, true);
    } else {
      cb(new Error('Unexpected field'));
    }
  },
});


const registerUser = async (req, res) => {
  try {
    const { username, email, password, firstName, lastName, phoneNumber } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword, firstName, lastName, phoneNumber });

    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).exec();
    if (!user) {
      return res.status(401).json({ error: "Authentication failed - User doesn't exist" });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Authentication failed - Password doesn't match" });
    }
    req.session.userId = user._id;
    req.session.username = user.username;
    req.session.save((err) => {
      if (err) {
        console.log('Error saving session:', err);
      } else {
        console.log('Session saved successfully:', req.session);
      }
    });
    res.json({
      status: true,
      message: "Login success",
      user: { id: user._id, username: user.username }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: "Login failed", errorMessage: error.message });
  }
};


const logoutUser = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Could not log out, please try again' });
    }
    res.clearCookie('connect.sid', { path: '/' }); 
    res.status(200).json({ message: "Logout successful" });
  });
};

router.delete('/deleteUser/:id', ensureAuthenticated, async (req, res) => {
  try {
    const userId = req.params.id;
    await User.findByIdAndDelete(userId);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Failed to delete user' });
  }
});

router.get('/users', ensureAuthenticated, async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const users = await User.find({ _id: { $ne: loggedInUserId } }, 'username firstName lastName email phoneNumber profilePicture');
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Failed to fetch users.' });
  }
});

router.get('/username', ensureAuthenticated, async (req, res) => {
  try {
    const users = await User.find({}, 'username'); 
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/userCount', ensureAuthenticated, async (req, res) => {
  try {
    const userCount = await User.countDocuments({});
    res.json({ count: userCount });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching user count' });
  }
});

router.post('/updateProfile', ensureAuthenticated, upload.fields([{ name: 'profileBanner', maxCount: 1 }, { name: 'profilePicture', maxCount: 1 }]), async (req, res) => {
  try {
    const userId = req.session.userId;
    const { firstName, lastName, username, email, phoneNumber, bio } = req.body;
    const updateData = {
      firstName,
      lastName,
      username,
      email,
      phoneNumber,
      bio,
    };

    if (req.files) {
      if (req.files.profileBanner) {
        updateData.profileBanner = req.files.profileBanner[0].filename;
      }
      if (req.files.profilePicture) {
        updateData.profilePicture = req.files.profilePicture[0].filename;
      }
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });
    res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});



router.get('/currentUser', ensureAuthenticated, async (req, res) => {
  try {
    const userId = req.session.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await User.findById(userId, 'firstName lastName username email phoneNumber bio profileBanner profilePicture');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ message: 'Failed to fetch user data' });
  }
});




router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', ensureAuthenticated, logoutUser);

module.exports = router;
