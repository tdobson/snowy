// ./models/instance.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

class Instance extends Model {}

Instance.init({
    instanceId: {
        type: DataTypes.CHAR(36),
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    instanceNameKey: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
    },
    instanceName: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    instanceDescription: DataTypes.STRING(255),
    instanceLogoUrl: DataTypes.STRING(255),
    instanceKeyContact: {
        type: DataTypes.CHAR(36),
        references: {
            model: 'sn_users', // Ensure this matches your users table name
            key: 'user_id',
        }
    },
    importId: {
        type: DataTypes.CHAR(36),
        references: {
            model: 'sn_import_events', // Ensure this matches your import events table name
            key: 'import_id',
        }
    },
}, {
    sequelize,
    modelName: 'Instance',
    tableName: 'sn_instances',
    underscored: true,
});

module.exports = Instance;
