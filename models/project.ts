import { Model, DataTypes, Sequelize } from 'sequelize';
import { ProjectAttributes, ProjectCreationAttributes } from '../types/project';

class Project extends Model<ProjectAttributes, ProjectCreationAttributes> implements ProjectAttributes {
    public projectId!: string;
    public clientId!: string;
    public instanceId!: string;
    public pvNumber!: string;
    public dnoDetailsId!: string;
    public regionId?: string;
    public siteId?: string;
    public refNumber?: string;
    public projectName?: string;
    public jobCode?: string;
    public comments?: string;
    public importId?: string;
    public projectProcessId?: string;
    public dnoZone?: string;

    public static initialize(sequelize: Sequelize): void {
        this.init({
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
            instanceId: {
                type: DataTypes.CHAR(36),
                references: {
                    model: 'sn_instances',
                    key: 'instance_id',
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
        }, {
            sequelize,
            modelName: 'Project',
            tableName: 'sn_projects',
            underscored: true,
        });
    }
}

export default Project;
import { Model, DataTypes, Sequelize } from 'sequelize';
import { ProjectAttributes, ProjectCreationAttributes } from '../types/project';

class Project extends Model<ProjectAttributes, ProjectCreationAttributes> implements ProjectAttributes {
    public projectId!: string;
    public clientId!: string;
    public instanceId!: string;
    public pvNumber!: string;
    public dnoDetailsId!: string;
    public regionId?: string;
    public siteId?: string;
    public refNumber?: string;
    public projectName?: string;
    public jobCode?: string;
    public comments?: string;
    public importId?: string;
    public projectProcessId?: string;
    public dnoZone?: string;

    public static initialize(sequelize: Sequelize) {
        this.init({
            projectId: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            clientId: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            instanceId: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            pvNumber: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            dnoDetailsId: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            regionId: {
                type: DataTypes.UUID,
                allowNull: true,
            },
            siteId: {
                type: DataTypes.UUID,
                allowNull: true,
            },
            refNumber: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            projectName: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            jobCode: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            comments: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            importId: {
                type: DataTypes.UUID,
                allowNull: true,
            },
            projectProcessId: {
                type: DataTypes.UUID,
                allowNull: true,
            },
            dnoZone: {
                type: DataTypes.STRING,
                allowNull: true,
            },
        }, {
            sequelize,
            modelName: 'Project',
            tableName: 'projects',
            underscored: true,
        });
    }
}

export default Project;
