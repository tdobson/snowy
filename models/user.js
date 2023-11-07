const { Sequelize, sequelize } = require('./index');

const User = sequelize.define('wp_members_db', {
    first_name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    last_name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    // Other fields if needed
});

module.exports = User;
