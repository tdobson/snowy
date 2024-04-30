// ./models/projectProcess.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

class ProjectProcess extends Model {}

ProjectProcess.init({
    projectProcessId: {
        type: DataTypes.CHAR(36),
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    instanceId: {
        type: DataTypes.CHAR(36),
        references: {
            model: 'sn_instances', // Ensure this matches your users table name
            key: 'instance_id',
        }
    },
    approvalStatus: {
        type: DataTypes.CHAR(36),
        references: {
            model: 'sn_status', // Ensure this matches your status table name
            key: 'status_id',
        }
    },
    deadlineToConnect: DataTypes.DATE,
    authLetterSent: DataTypes.BOOLEAN,
    mpanRequestSent: DataTypes.BOOLEAN,
    schematicCreated: DataTypes.BOOLEAN,
    applicationType: DataTypes.STRING,
    formalDnoSubmitted: DataTypes.BOOLEAN,
    submissionDate: DataTypes.DATE,
    dnoDueDate: DataTypes.DATE,
    dnoStatus: {
        type: DataTypes.CHAR(36),
        references: {
            model: 'sn_status', // Ensure this matches your status table name
            key: 'status_id',
        }
    },
    approvedKwp: DataTypes.FLOAT,
    quoteReceived: DataTypes.BOOLEAN,
    customerInvoicedDate: DataTypes.DATE,
    dnoPaymentMade: DataTypes.DATE,
    acceptanceFormReturned: DataTypes.BOOLEAN,
    dateApproved: DataTypes.DATE,
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
    modelName: 'ProjectProcess',
    tableName: 'sn_project_process',
    underscored: true,
});

module.exports = ProjectProcess;
