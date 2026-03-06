require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sequelize, User } = require('./models');

const app = express();
const PORT = process.env.PORT || 5001; // Using 5001 to avoid conflict with frontend dev server usually on 3000/5000

app.use(cors());
app.use(express.json());

// Main entry to test the API
app.get('/api/health', (req, res) => {
  res.json({ message: 'Backend is running correctly', dbStatus: 'Attempting to check...' });
});

// Login route
app.post('/api/auth/signin/local', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).send('Utilisateur non trouvé');
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send('Mot de passe incorrect');
    }

    // Generate JWT
    const token = jwt.sign(
      { user: { id: user.id, email: user.email, username: user.username } },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '24h' }
    );

    res.json(token);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur serveur');
  }
});

// Database synchronization and server start
const startServer = async () => {
  try {
    // Authenticate and synchronize models
    await sequelize.authenticate();
    console.log('PostgreSQL connected...');
    
    // sync() will create the table if it doesn't exist (and does nothing if it already exists)
    // In production, you might want to use migrations instead
    await sequelize.sync({ force: false });
    console.log('Database synchronized');

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
};

startServer();
