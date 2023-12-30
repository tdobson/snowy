// ./models/address.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');


class Address extends Model {}

Address.init({
    addressId: {
        type: DataTypes.CHAR(36),
        primaryKey: true,
    },
    addressLine1: DataTypes.STRING,
    addressLine2: DataTypes.STRING,
    addressTown: DataTypes.STRING,
    addressCounty: DataTypes.STRING,
    addressPostcode: DataTypes.STRING,
    addressCountry: DataTypes.STRING,
    addressRegionId: {
        type: DataTypes.CHAR(36),
        references: {
            model: 'sn_regions', // Ensure this matches your regions table name
            key: 'region_id',
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
    modelName: 'Address',
    tableName: 'sn_addresses'
});

module.exports = Address;
