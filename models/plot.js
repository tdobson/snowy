// ./models/plot.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

class Plot extends Model {}

Plot.init({
    plotId: {
        type: DataTypes.CHAR(36),
        primaryKey: true,
    },
    projectId: {
        type: DataTypes.CHAR(36),
        references: {
            model: 'sn_projects', // Ensure this matches your projects table name
            key: 'project_id',
        }
    },
    plotInstallId: {
        type: DataTypes.CHAR(36),
        references: {
            model: 'sn_plot_install',
            key: 'plot_install_id',
        }
    },
    plotSpecId: {
        type: DataTypes.CHAR(36),
        references: {
            model: 'sn_plot_spec',
            key: 'plot_spec_id',
        }
    },
    plotNumber: {
        type: DataTypes.STRING,
        allowNull: false
    },
    plotStatus: {
        type: DataTypes.CHAR(36),
        references: {
            model: 'sn_status', // Ensure this matches your status table name
            key: 'status_id',
        }
    },
    site: {
        type: DataTypes.CHAR(36),
        references: {
            model: 'sn_sites', // Ensure this matches your sites table name
            key: 'site_id',
        }
    },
    housetype: DataTypes.STRING,
    g99: DataTypes.BOOLEAN,
    mpan: DataTypes.STRING,
    plotAddressId: {
        type: DataTypes.CHAR(36),
        references: {
            model: 'sn_addresses', // Ensure this matches your addresses table name
            key: 'address_id',
        }
    },
    plotApproved: DataTypes.BOOLEAN,
    commissioningFormSubmitted: DataTypes.BOOLEAN,
    importId: {
        type: DataTypes.CHAR(36),
        references: {
            model: 'sn_import_events', // Ensure this matches your import events table name
            key: 'import_id',
        }
    },
    trackerRef: DataTypes.CHAR(36),
    // Additional fields can be added here as necessary
}, {
    sequelize,
    modelName: 'Plot',
    tableName: 'sn_plots'
});

module.exports = Plot;
