// ./models/project.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

class Project extends Model {}

Project.init({
    projectId: {
        type: DataTypes.CHAR(36),
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    clientId: {
        type: DataTypes.CHAR(36),
        allowNull: false,
        references: {
            model: 'sn_clients',
            key: 'client_id',
        }
    },
    pvNumber: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
    },
    dnoDetailsId: {
        type: DataTypes.CHAR(36),
        allowNull: false,
        references: {
            model: 'sn_dno_details',
            key: 'dno_details_id',
        }
    },
    regionId: {
        type: DataTypes.CHAR(36),
        references: {
            model: 'sn_region',
            key: 'region_id',
        }
    },
    siteId: {
        type: DataTypes.CHAR(36),
        references: {
            model: 'sn_sites',
            key: 'site_id',
        }
    },
    refNumber: DataTypes.STRING(255),
    projectName: DataTypes.STRING(255),
    jobCode: DataTypes.STRING(255),
    comments: DataTypes.TEXT,
    importId: {
        type: DataTypes.CHAR(36),
        references: {
            model: 'sn_import_events',
            key: 'import_id',
        }
    },
    projectProcessId: {
        type: DataTypes.CHAR(36),
        references: {
            model: 'sn_project_process',
            key: 'project_process_id',
        }
    },
    dnoZone: DataTypes.STRING(255),
    // Additional fields can be added here as necessary
}, {
    sequelize,
    modelName: 'Project',
    tableName: 'sn_projects'
});

module.exports = Project;
