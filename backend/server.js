const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const groupRoutes = require('./routes/groupRoutes');
const friendExpenseRoute = require('./routes/friendExpenseRoute');
const groupExpenseRoutes = require('./routes/groupExpenseRoutes');
const bodyParser = require('body-parser');
const upload = require('./multer');  
require('dotenv').config();
const path = require('path')

const app = express();
const PORT = 5000;

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use(session({
  secret: process.env.SESSION_SECRET || 'EasySplit',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ 
    mongoUrl: process.env.MONGO_URL, 
    collectionName: 'sessions' 
  }),
  cookie: { 
    secure: process.env.NODE_ENV === 'production', 
    httpOnly: true, 
    sameSite: 'strict', 
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  }
}));

// Routes
app.use('/auth', authRoutes);
app.use('/group', groupRoutes);
app.use('/friendexpense', friendExpenseRoute);
app.use('/groupexpense', groupExpenseRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URL);
mongoose.set('bufferCommands', true);

const database = mongoose.connection;

database.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});

database.once('open', () => {
  console.log('Connected to MongoDB');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
