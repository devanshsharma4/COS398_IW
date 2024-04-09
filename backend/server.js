const express = require('express');
const multer = require('multer');
const path = require('path');
const sequelize = require('./config/database.js'); // Adjust the path as necessary
const User = require('./models/user.js'); // Import the User model
const Image = require('./models/image.js'); // Import the Image model
const userRoutes = require('./routes/userRoutes.js'); // Import the user routes

const app = express();
app.use(express.json()); // Middleware to parse JSON bodies
app.use('/users', userRoutes); // Use the user routes

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

// Express routes for image uploading
app.post('/api/upload', upload.single('picture'), async (req, res) => {
  try {
      // Assuming your Image model is correctly set up to handle Sequelize
      const newImage = await Image.create({
          goal: req.body.goal,
          imagePath: req.file.path, // Save the path of the uploaded file
          userId: req.userId 
      });

      res.json({ message: 'Image uploaded successfully', imagePath: req.file.path });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to upload image' });
  }
});


app.get('/api/images', async (req, res) => {
  try {
      // Adjust to match your actual model and desired attributes
      const images = await Image.findAll({
          attributes: ['imagePath', 'goal'], // Assuming these are the fields you want to send
          order: [['createdAt', 'DESC']],
          limit: 3
      });
      res.json(images.map(image => ({ 
          url: image.imagePath, // Assuming you serve images statically and this path is accessible via URL
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