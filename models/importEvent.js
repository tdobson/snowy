// ./models/importEvent.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

class ImportEvent extends Model {}

ImportEvent.init({
    importId: {
        type: DataTypes.CHAR(36),
        primaryKey: true,
    },
    importDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    importedBy: {
        type: DataTypes.CHAR(36),
        references: {
            model: 'sn_users', // Ensure this matches your users table name
            key: 'user_id',
        }
    },
    modifiedDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    modifiedBy: {
        type: DataTypes.CHAR(36),
        references: {
            model: 'sn_users', // Ensure this matches your users table name
            key: 'user_id',
        }
    },
    modificationRef: DataTypes.STRING,
    importRef: DataTypes.STRING,
    importSource: DataTypes.STRING,
    importNotes: DataTypes.TEXT,
    // Additional fields can be added here as necessary
}, {
    sequelize,
    modelName: 'ImportEvent',
    tableName: 'sn_import_events'
});

module.exports = ImportEvent;
