// ./models/region.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

class Region extends Model {}

Region.init({
    regionId: {
        type: DataTypes.CHAR(36),
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4 ,
    },
    regionNumber: {
        type: DataTypes.CHAR(10),
        unique: true,
        allowNull: false
    },
    instanceId: {
        type: DataTypes.CHAR(36),
        references: {
            model: 'sn_instances', // Ensure this matches your users table name
            key: 'instance_id',
        }
    },
    regionName: DataTypes.STRING,
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
    modelName: 'Region',
    tableName: 'sn_region',
    underscored: true,
});

module.exports = Region;
