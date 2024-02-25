// ./models/job.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

class Job extends Model {}

Job.init({
    jobId: {
        type: DataTypes.CHAR(36),
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    plotId: {
        type: DataTypes.CHAR(36),
        references: {
            model: 'sn_plots', // Ensure this matches your plots table name
            key: 'plot_id',
        }
    },
    projectId: {
        type: DataTypes.CHAR(36),
        references: {
            model: 'sn_projects', // Ensure this matches your projects table name
            key: 'project_id',
        }
    },
    userId: {
        type: DataTypes.CHAR(36),
        references: {
            model: 'sn_users', // Ensure this matches your users table name
            key: 'user_id',
        }
    },
    slotId: {
        type: DataTypes.CHAR(36),
        references: {
            model: 'sn_slots', // Ensure this matches your slots table name
            key: 'slot_id',
        }
    },
    jobStatus: {
        type: DataTypes.CHAR(36),
        references: {
            model: 'sn_status', // Ensure this matches your status table name
            key: 'status_id',
        }
    },
    dispatchId: DataTypes.STRING,
    submissionId: {
        type: DataTypes.CHAR(36),
        references: {
            model: 'sn_form_submissions', // Ensure this matches your form submissions table name
            key: 'submission_id',
        }
    },
    dispatchedAt: DataTypes.DATE,
    dispatchedBy: {
        type: DataTypes.CHAR(36),
        references: {
            model: 'sn_users', // Ensure this matches your users table name
            key: 'user_id',
        }
    },
    returnedAt: DataTypes.DATE,
    returnedBy: {
        type: DataTypes.CHAR(36),
        references: {
            model: 'sn_users', // Ensure this matches your users table name
            key: 'user_id',
        }
    },
    dispatchTeam: {
        type: DataTypes.CHAR(36),
        references: {
            model: 'sn_teams', // Ensure this matches your teams table name
            key: 'team_id',
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
    modelName: 'Job',
    tableName: 'sn_jobs'
});

module.exports = Job;
