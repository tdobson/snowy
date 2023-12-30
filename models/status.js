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
    statusState: {
        type: DataTypes.STRING,
        allowNull: false
    },
    statusName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    statusCode: DataTypes.STRING,
    statusDescription: DataTypes.STRING,
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
    tableName: 'sn_status'
});

module.exports = Status;
