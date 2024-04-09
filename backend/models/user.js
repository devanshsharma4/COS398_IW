const Sequelize = require('sequelize');
const sequelize = require('../config/database.js'); // Adjust the path as necessary

const User = sequelize.define('user', {
    // Define attributes
    username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
    }
    // You can add more attributes like username, etc.
});

module.exports = User;
