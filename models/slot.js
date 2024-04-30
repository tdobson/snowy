// ./models/slot.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

class Slot extends Model {}

Slot.init({
    slotId: {
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
    date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    locationSlot: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    timeSlot: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    jobId: {
        type: DataTypes.CHAR(36),
        references: {
            model: 'sn_jobs', // Ensure this matches your jobs table name
            key: 'job_id',
        }
    },
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
    modelName: 'Slot',
    tableName: 'sn_slots',
    underscored: true,
});

module.exports = Slot;
