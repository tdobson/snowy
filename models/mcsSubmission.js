// ./models/mcsSubmission.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
class McsSubmission extends Model {}

McsSubmission.init({
    mcsSubmissionId: {
        type: DataTypes.CHAR(36),
        primaryKey: true,
    },
    mcsSubmitStatus: {
        type: DataTypes.CHAR(36),
        references: {
            model: 'sn_status',
            key: 'status_id',
        }
    },
    mcsCertificateNumber: DataTypes.STRING,
    mcsCertificateId: DataTypes.STRING,
    mcsCertificateDate: DataTypes.DATE,
    mcsLoadedDate: DataTypes.DATE,
    mcsSubmittedDate: DataTypes.DATE,
    mcsCheckedDate: DataTypes.DATE,
    mcsApiReturnMessage: DataTypes.TEXT,
    submissionCheckedBy: {
        type: DataTypes.CHAR(36),
        references: {
            model: 'sn_users',
            key: 'user_id',
        }
    },
    submittedBy: {
        type: DataTypes.CHAR(36),
        references: {
            model: 'sn_users',
            key: 'user_id',
        }
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
    modelName: 'McsSubmission',
    tableName: 'sn_mcs_submission'
});

module.exports = McsSubmission;
