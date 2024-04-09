const Sequelize = require('sequelize');

const sequelize = new Sequelize('pomodoro_timer', 'postgres', 'Devu1234', {
    host: 'localhost',
    dialect: 'postgres',
    logging: false, // toggle this for debugging SQL queries
});

module.exports = sequelize;
