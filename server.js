const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const articlesRoutes = require('./Router/articlesRoutes');
const userRoutes = require('./Router/userRoutes');

// Load environment variables (.env)
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse incoming JSON request bodies
app.use(express.json());

// Mount modular domain routers
app.use('/api/articles', articlesRoutes);
app.use('/api/users', userRoutes);

// Asynchronously connect to MongoDB Atlas before listening
(async () => {
  try {
    // 1. Establish remote connection to Atlas
    await connectDB(process.env.MONGODB_URI);

    // 2. Start HTTP server listener
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
})();