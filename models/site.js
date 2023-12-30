// ./models/site.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

class Site extends Model {}

Site.init({
    siteId: {
        type: DataTypes.CHAR(36),
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    projectId: {
        type: DataTypes.CHAR(36),
        references: {
            model: 'sn_projects', // Ensure this matches your projects table name
            key: 'project_id',
        }
    },
    dnoDetailsId: {
        type: DataTypes.CHAR(36),
        references: {
            model: 'sn_dno_details', // Ensure this matches your DNO details table name
            key: 'dno_details_id',
        }
    },
    siteAddressId: {
        type: DataTypes.CHAR(36),
        references: {
            model: 'sn_addresses', // Ensure this matches your addresses table name
            key: 'address_id',
        }
    },
    siteManagerId: {
        type: DataTypes.CHAR(36),
        references: {
            model: 'sn_users', // Ensure this matches your users table name
            key: 'user_id',
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
    modelName: 'Site',
    tableName: 'sn_sites'
});

module.exports = Site;
