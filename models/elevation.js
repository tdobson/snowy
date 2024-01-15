// ./models/elevation.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

class Elevation extends Model {}

Elevation.init({
    elevationId: {
        type: DataTypes.CHAR(36),
        primaryKey: true,
    },
    plotRefId: {
        type: DataTypes.CHAR(36),
        references: {
            model: 'sn_plots', // Ensure this matches your plots table name
            key: 'plot_id',
        }
    },
    plotId: {
        type: DataTypes.CHAR(36),
        allowNull: false
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
    modelName: 'Elevation',
    tableName: 'sn_elevations'
});

// In the Elevation model, you can add a method to get the associated record
Elevation.prototype.getAssociatedRecord = async function () {
    if (this.plotInstall) {
        return this.plotInstall;
    } else if (this.plotSpec) {
        return this.plotSpec;
    } else {
        return null;
    }
};

module.exports = Elevation;
