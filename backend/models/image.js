// image.js
const Sequelize = require('sequelize');
const sequelize = require('../config/database'); // Adjust the path to your database.js file

const Image = sequelize.define('image', {
    goal: {
        type: Sequelize.STRING,
        allowNull: false
    },
    imagePath: {
        type: Sequelize.STRING,
        allowNull: false
    },
    userId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
            model: 'users',
            key: 'email'
        }
    }
}, {
    timestamps: true // Adds createdAt and updatedAt timestamps
});

module.exports = Image;
