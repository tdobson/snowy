import { Model, DataTypes, Sequelize } from 'sequelize';
import { JobAttributes, JobCreationAttributes } from '../types/job';

class Job extends Model<JobAttributes, JobCreationAttributes> implements JobAttributes {
    public jobId!: string;
    public plotId!: string;
    public instanceId!: string;
    public projectId!: string;
    public userId!: string;
    public slotId!: string;
    public jobStatus!: string;
    public dispatchId?: string;
    public submissionId?: string;
    public jobType?: string;
    public dispatchedAt?: Date;
    public dispatchedBy?: string;
    public returnedAt?: Date;
    public returnedBy?: string;
    public dispatchTeam?: string;
    public importId?: string;

    public static initialize(sequelize: Sequelize): void {
        this.init({
            jobId: {
                type: DataTypes.CHAR(36),
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4
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
            projectId: {
                type: DataTypes.CHAR(36),
                references: {
                    model: 'sn_projects',
                    key: 'project_id',
                }
            },
            userId: {
                type: DataTypes.CHAR(36),
                references: {
                    model: 'sn_users',
                    key: 'user_id',
                }
            },
            slotId: {
                type: DataTypes.CHAR(36),
                references: {
                    model: 'sn_slots',
                    key: 'slot_id',
                }
            },
            jobStatus: {
                type: DataTypes.CHAR(36),
                references: {
                    model: 'sn_status',
                    key: 'status_id',
                }
            },
            dispatchId: DataTypes.STRING,
            submissionId: {
                type: DataTypes.CHAR(36),
                references: {
                    model: 'sn_form_submissions',
                    key: 'submission_id',
                }
            },
            jobType: DataTypes.STRING,
            dispatchedAt: DataTypes.DATE,
            dispatchedBy: {
                type: DataTypes.CHAR(36),
                references: {
                    model: 'sn_users',
                    key: 'user_id',
                }
            },
            returnedAt: DataTypes.DATE,
            returnedBy: {
                type: DataTypes.CHAR(36),
                references: {
                    model: 'sn_users',
                    key: 'user_id',
                }
            },
            dispatchTeam: {
                type: DataTypes.CHAR(36),
                references: {
                    model: 'sn_teams',
                    key: 'team_id',
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
            modelName: 'Job',
            tableName: 'sn_jobs',
            underscored: true,
        });
    }
}

export default Job;
