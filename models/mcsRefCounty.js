// ./models/mcsRefCounty.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

class McsRefCounty extends Model {}

McsRefCounty.init({
    mcsCountyId: {
        type: DataTypes.CHAR(36),
        primaryKey: true,
    },
    mcsCountyName: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    mcsApiCountyId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    importId: {
        type: DataTypes.CHAR(36),
        references: {
            model: 'sn_import_events',
            key: 'import_id',
        }
    },
    // Additional fields can be added here as necessary
}, {
    sequelize,
    modelName: 'McsRefCounty',
    tableName: 'sn_mcs_ref_counties'
});

module.exports = McsRefCounty;
