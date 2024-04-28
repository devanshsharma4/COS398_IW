const express = require('express');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');  // Make sure to install via npm
const sequelize = require('./config/database.js'); // Adjust the path as necessary
const User = require('./models/user.js'); // Import the User model
const Image = require('./models/image.js'); // Import the Image model
const auth = require('./middleware/authMiddleware.js'); 
const cors = require('cors');


require('dotenv').config();


const app = express();
app.use(cors());
app.use(express.json()); // Middleware to parse JSON bodies
// app.use('/users', userRoutes); // Use the user routes
 
const jwtSecret = process.env.JWT_SECRET || 'default-secret';

// Define model associations
User.hasMany(Image, { foreignKey: 'userId' });
Image.belongsTo(User, { foreignKey: 'userId' });

// Set up storage for Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // Append the date to avoid name conflicts
    },
  });

const upload = multer({ storage: storage });


// Registration endpoint
app.post('/api/register', async (req, res) => {
  const {email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  try {
      // Check if the user already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
          return res.status(400).json({ error: 'User already exists' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new user record
      const newUser = await User.create({
          email,
          password: hashedPassword
      });

      // Optionally create a token
      const token = jwt.sign(
          { userId: newUser.id },
          jwtSecret, // Replace 'your-secret-key' with your actual secret key
          { expiresIn: '24h' }
      );

      res.status(201).json({
        success: true,
        message: 'User registered',
        token: token
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error during registration' });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
      // Find the user by email
      const user = await User.findOne({ where: { email } });
      if (!user) {
          return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Check if the password is correct
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
          return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Create a token
      const token = jwt.sign(
          { userId: user.id },
          jwtSecret, // Replace with your actual secret key
          { expiresIn: '24h' }
      );

      res.json({
        success: true,
        message: 'Logged in successfully',
        token: token
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

// Express routes for image uploading
app.post('/api/upload', auth, upload.single('picture'), async (req, res) => {
  try {
      // The 'auth' middleware should authenticate the user and set 'req.user'
      // Extract the 'userId' from 'req.user' object set by the 'auth' middleware
      const userId = req.user.userId;

      // Assuming your Image model is correctly set up to handle Sequelize
      const newImage = await Image.create({
          goal: req.body.goal,
          imagePath: req.file.path, // Save the path of the uploaded file
          userId: userId // Include the userId from the authenticated user
      });
      
      res.json({ message: 'Image uploaded successfully', imagePath: req.file.path, newImage });

  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to upload image', error: error.message });
  }
});


app.get('/api/images', async (req, res) => {
  try {
      // Adjust to match your actual model and desired attributes
      const images = await Image.findAll({
          attributes: ['imagePath', 'goal'], 
          order: [['createdAt', 'DESC']],
          limit: 3
      });
      res.json(images.map(image => ({ 
          url: image.imagePath, 
          goal: image.goal
      })));
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to fetch images' });
  }
});

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

  
sequelize.sync().then(() => {
    console.log("Database synced!");
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch((error) => {
    console.error("Failed to sync database:", error);
});