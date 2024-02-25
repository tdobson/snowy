// ./models/client.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

class Client extends Model {}

Client.init({
    clientId: {
        type: DataTypes.CHAR(36),
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    clientLegacyNumber: DataTypes.STRING(255),
    clientName: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
    },
    clientAddressId: {
        type: DataTypes.CHAR(36),
        references: {
            model: 'sn_addresses', // Ensure this matches the table name in your database
            key: 'address_id',
        }
    },
    clientPlotCardRequired: DataTypes.STRING(255),
    contactId: {
        type: DataTypes.CHAR(36),
        references: {
            model: 'sn_users', // Ensure this matches the table name in your database
            key: 'user_id',
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
    modelName: 'Client',
    tableName: 'sn_clients'
});

module.exports = Client;
