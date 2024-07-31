import { Model, DataTypes, Sequelize } from 'sequelize';
import { ProjectProcessAttributes, ProjectProcessCreationAttributes } from '../types/projectProcess';

class ProjectProcess extends Model<ProjectProcessAttributes, ProjectProcessCreationAttributes> implements ProjectProcessAttributes {
    public projectProcessId!: string;
    public instanceId!: string;
    public approvalStatus?: string;
    public deadlineToConnect?: Date;
    public authLetterSent?: boolean;
    public mpanRequestSent?: boolean;
    public schematicCreated?: boolean;
    public applicationType?: string;
    public formalDnoSubmitted?: boolean;
    public submissionDate?: Date;
    public dnoDueDate?: Date;
    public dnoStatus?: string;
    public approvedKwp?: number;
    public quoteReceived?: boolean;
    public customerInvoicedDate?: Date;
    public dnoPaymentMade?: Date;
    public acceptanceFormReturned?: boolean;
    public dateApproved?: Date;
    public importId?: string;

    public static initialize(sequelize: Sequelize): void {
        this.init({
            projectProcessId: {
                type: DataTypes.CHAR(36),
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4
            },
            instanceId: {
                type: DataTypes.CHAR(36),
                references: {
                    model: 'sn_instances',
                    key: 'instance_id',
                }
            },
            approvalStatus: {
                type: DataTypes.CHAR(36),
                references: {
                    model: 'sn_status',
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
                    model: 'sn_status',
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
                    model: 'sn_import_events',
                    key: 'import_id',
                }
            },
        }, {
            sequelize,
            modelName: 'ProjectProcess',
            tableName: 'sn_project_process',
            underscored: true,
        });
    }
}

export default ProjectProcess;
