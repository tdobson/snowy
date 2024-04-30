// ./models/dnoDetail.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

class DnoDetail extends Model {}

DnoDetail.init({
    dnoDetailsId: {
        type: DataTypes.CHAR(36),
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    mpanPrefix: {
        type: DataTypes.INTEGER,
        unique: true,
        allowNull: false
    },
    dnoName: {
        type: DataTypes.STRING,
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
    address: DataTypes.STRING,
    emailAddress: DataTypes.STRING,
    contactNo: DataTypes.STRING,
    internalTel: DataTypes.STRING,
    type: DataTypes.STRING,
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
    modelName: 'DnoDetail',
    tableName: 'sn_dno_details',
    underscored: true,
});

module.exports = DnoDetail;
