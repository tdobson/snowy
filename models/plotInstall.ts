// ./models/plotInstall.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

class PlotInstall extends Model {}

PlotInstall.init({
    plotInstallId: {
        type: DataTypes.CHAR(36),
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    plotId: {
        type: DataTypes.CHAR(36),
        allowNull: false,
        references: {
            model: 'sn_plots',
            key: 'plot_id',
        }
    },
    instanceId: {
        type: DataTypes.CHAR(36),
        references: {
            model: 'sn_instances', // Ensure this matches your users table name
            key: 'instance_id',
        }
    },
    dateInstall: DataTypes.DATE,
    dateChecked: DataTypes.DATE,
    installBy: {
        type: DataTypes.CHAR(36),
        references: {
            model: 'sn_users', // Ensure this matches your users table name
            key: 'user_id',
        }
    },
    checkedBy: {
        type: DataTypes.CHAR(36),
        references: {
            model: 'sn_users', // Ensure this matches your users table name
            key: 'user_id',
        }
    },
    plotInstallStatus: {
        type: DataTypes.CHAR(36),
        references: {
            model: 'sn_status', // Ensure this matches your status table name
            key: 'status_id',
        }
    },
    phase: DataTypes.INTEGER,
    p1: DataTypes.FLOAT,
    p2: DataTypes.FLOAT,
    p3: DataTypes.FLOAT,
    annualYield: DataTypes.FLOAT,
    kwp: DataTypes.FLOAT,
    kwpWithLimitation: DataTypes.FLOAT,
    limiterRequired: DataTypes.BOOLEAN,
    limiterValueIfNotZero: DataTypes.FLOAT,
    labourCost: DataTypes.FLOAT,
    meter: {
        type: DataTypes.CHAR(36),
        references: {
            model: 'sn_products', // Ensure this matches your products table name
            key: 'product_id',
        }
    },
    meterCost: DataTypes.FLOAT,
    battery: {
        type: DataTypes.CHAR(36),
        references: {
            model: 'sn_products', // Ensure this matches your products table name
            key: 'product_id',
        }
    },
    batteryCost: DataTypes.FLOAT,
    overallCost: DataTypes.FLOAT,
    mcsSubmissionId: {
        type: DataTypes.CHAR(36),
        references: {
            model: 'sn_mcs_submission', // Ensure this matches your MCS submission table name
            key: 'mcs_submission_id',
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
    modelName: 'PlotInstall',
    tableName: 'sn_plot_install',
    underscored: true,
});

module.exports = PlotInstall;
