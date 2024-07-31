// ./models/status.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

class Status extends Model {}

Status.init({
    statusId: {
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
    statusState: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    statusName: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    statusGroup: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    statusCode: DataTypes.STRING(255),
    statusDescription: DataTypes.STRING(510),
    importId: {
        type: DataTypes.CHAR(36),
        references: {
            model: 'sn_import_events', // Ensure this matches your import events table name
            key: 'import_id',
        }
    },
    // Additional fields can be added here as necessary
}, {
    sequelize,
    modelName: 'Status',
    tableName: 'sn_status',
    underscored: true,
});

module.exports = Status;
