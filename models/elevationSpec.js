// ./models/elevationSpec.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

class ElevationSpec extends Model {}

ElevationSpec.init({
    elevationSpecId: {
        type: DataTypes.CHAR(36),
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    plotSpecId: {
        type: DataTypes.CHAR(36),
        references: {
            model: 'sn_plot_install', // Ensure this matches your plots table name
            key: 'plot_spec_id',
        }
    },
    plotId: {
        type: DataTypes.CHAR(36),
        allowNull: false
    },
    instanceId: {
        type: DataTypes.CHAR(36),
        references: {
            model: 'sn_instances', // Ensure this matches your users table name
            key: 'instance_id',
        }
    },
    typeTestRef: DataTypes.STRING(255),
    pitch: DataTypes.FLOAT,
    orientation: DataTypes.STRING(255),
    kkFigure: DataTypes.FLOAT,
    kwp: DataTypes.FLOAT,
    strings: DataTypes.INTEGER,
    moduleQty: DataTypes.INTEGER,
    inverter: {
        type: DataTypes.STRING(255),
        references: {
            model: 'sn_products', // Ensure this matches your products table name
            key: 'product_id',
        }
    },
    inverterCost: DataTypes.FLOAT,
    panel: {
        type: DataTypes.STRING(255),
        references: {
            model: 'sn_products', // Ensure this matches your products table name
            key: 'product_id',
        }
    },
    panelCost: DataTypes.FLOAT,
    panelsTotalCost: DataTypes.FLOAT,
    roofKit: {
        type: DataTypes.STRING(255),
        references: {
            model: 'sn_products', // Ensure this matches your products table name
            key: 'product_id',
        }
    },
    roofKitCost: DataTypes.FLOAT,
    annualYield: DataTypes.FLOAT,
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
    modelName: 'ElevationSpec',
    tableName: 'sn_elevations_spec',
    underscored: true,
});

module.exports = ElevationSpec;
