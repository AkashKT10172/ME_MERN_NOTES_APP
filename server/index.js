const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');  // Import the CORS middleware
const connectDB = require('./config/db');
const noteRoutes = require('./routes/noteRoutes');
const authRoutes = require('./routes/authRoutes');

dotenv.config();

connectDB();

const app = express();

// Middleware
app.use(cors());  // Use CORS middleware to allow cross-origin requests
app.use(express.json()); // Parse JSON bodies

// Routes
app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
