// ./models/formSubmission.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

class FormSubmission extends Model {}

FormSubmission.init({
    submissionId: {
        type: DataTypes.CHAR(36),
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    dmSubmissionId: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    plotId: {
        type: DataTypes.CHAR(36),
        references: {
            model: 'sn_plots', // Ensure this matches your plots table name
            key: 'plot_id',
        }
    },
    jobId: {
        type: DataTypes.CHAR(36),
        references: {
            model: 'sn_jobs', // Ensure this matches your jobs table name
            key: 'job_id',
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
    modelName: 'FormSubmission',
    tableName: 'sn_form_submissions'
});

module.exports = FormSubmission;
