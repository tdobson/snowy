// ./models/user.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

class User extends Model {}

User.init({
    userId: {
        type: DataTypes.CHAR(36),
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    instanceId: {
        type: DataTypes.CHAR(36),
        references: {
            model: 'sn_instances', // Ensure this matches your users table name
            key: 'instance_id',
        }
    },
    ssoId: DataTypes.STRING(255),
    name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING(255)
    },
    phone: DataTypes.STRING(255),
    employer: DataTypes.STRING(255),
    teamId: {
        type: DataTypes.CHAR(36),
        references: {
            model: 'sn_teams', // Ensure this matches the table name in your database
            key: 'team_id',
        }
    },
    resetToken: {
        type: DataTypes.STRING,
        allowNull: true
    },
    resetTokenExpires: {
        type: DataTypes.DATE,
        allowNull: true
    },
    dispatchId: DataTypes.STRING(255),
    snowyRole: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    companyRole: DataTypes.STRING(255),
    categoryId: DataTypes.CHAR(36),
    userAddressId: {
        type: DataTypes.CHAR(36),
        references: {
            model: 'sn_addresses', // Ensure this matches the table name in your database
            key: 'address_id',
        }
    },
    importId: {
        type: DataTypes.CHAR(36),
        references: {
            model: 'sn_import_events', // Ensure this matches the table name in your database
            key: 'import_id',
        }
    },
    // Additional fields can be added here as necessary
}, {
    sequelize,
    modelName: 'User',
    tableName: 'sn_users',
    underscored: true,
});

module.exports = User;
