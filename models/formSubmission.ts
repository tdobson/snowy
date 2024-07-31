import { Model, DataTypes, Sequelize } from 'sequelize';
import { FormSubmissionAttributes, FormSubmissionCreationAttributes } from '../types/formSubmission';

class FormSubmission extends Model<FormSubmissionAttributes, FormSubmissionCreationAttributes> implements FormSubmissionAttributes {
    public submissionId!: string;
    public dmSubmissionId!: string;
    public plotId!: string;
    public instanceId!: string;
    public jobId!: string;
    public importId?: string;

    public static initialize(sequelize: Sequelize): void {
        this.init({
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
                    model: 'sn_plots',
                    key: 'plot_id',
                }
            },
            instanceId: {
                type: DataTypes.CHAR(36),
                references: {
                    model: 'sn_instances',
                    key: 'instance_id',
                }
            },
            jobId: {
                type: DataTypes.CHAR(36),
                references: {
                    model: 'sn_jobs',
                    key: 'job_id',
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
            modelName: 'FormSubmission',
            tableName: 'sn_form_submissions',
            underscored: true,
        });
    }
}

export default FormSubmission;
