const Sequelize = require('sequelize');
const sequelize = require('../config/database.js'); // Adjust the path as necessary

const User = sequelize.define('user', {
    // Define attributes
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
    }
});

module.exports = User;
