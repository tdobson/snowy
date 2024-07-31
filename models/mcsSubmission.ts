import { Model, DataTypes, Sequelize } from 'sequelize';
import { McsSubmissionAttributes, McsSubmissionCreationAttributes } from '../types/mcsSubmission';

class McsSubmission extends Model<McsSubmissionAttributes, McsSubmissionCreationAttributes> implements McsSubmissionAttributes {
    public mcsSubmissionId!: string;
    public mcsSubmitStatus!: string;
    public mcsCertificateNumber?: string;
    public mcsCertificateId?: string;
    public mcsCertificateDate?: Date;
    public mcsLoadedDate?: Date;
    public mcsSubmittedDate?: Date;
    public mcsCheckedDate?: Date;
    public mcsApiReturnMessage?: string;
    public submissionCheckedBy?: string;
    public submittedBy?: string;
    public importId?: string;

    public static initialize(sequelize: Sequelize): void {
        this.init({
            mcsSubmissionId: {
                type: DataTypes.CHAR(36),
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4
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
        }, {
            sequelize,
            modelName: 'McsSubmission',
            tableName: 'sn_mcs_submission',
            underscored: true,
        });
    }
}

export default McsSubmission;
