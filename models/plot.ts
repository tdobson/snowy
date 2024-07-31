import { Model, DataTypes, Sequelize } from 'sequelize';
import { PlotAttributes, PlotCreationAttributes } from '../types/plot';

class Plot extends Model<PlotAttributes, PlotCreationAttributes> implements PlotAttributes {
    public plotId!: string;
    public projectId!: string;
    public instanceId!: string;
    public plotInstallId?: string;
    public plotNumber!: string;
    public plotStatus!: string;
    public site?: string;
    public housetype?: string;
    public g99?: boolean;
    public mpan?: string;
    public plotAddressId?: string;
    public plotApproved?: boolean;
    public commissioningFormSubmitted?: boolean;
    public importId?: string;
    public trackerRef?: string;

    public static initialize(sequelize: Sequelize): void {
        this.init({
            plotId: {
                type: DataTypes.CHAR(36),
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4
            },
            projectId: {
                type: DataTypes.CHAR(36),
                references: {
                    model: 'sn_projects',
                    key: 'project_id',
                }
            },
            instanceId: {
                type: DataTypes.CHAR(36),
                references: {
                    model: 'sn_instances',
                    key: 'instance_id',
                }
            },
            plotInstallId: {
                type: DataTypes.CHAR(36),
                references: {
                    model: 'sn_plot_install',
                    key: 'plot_install_id',
                }
            },
            plotNumber: {
                type: DataTypes.STRING,
                allowNull: false
            },
            plotStatus: {
                type: DataTypes.CHAR(36),
                references: {
                    model: 'sn_status',
                    key: 'status_id',
                }
            },
            site: {
                type: DataTypes.CHAR(36),
                references: {
                    model: 'sn_sites',
                    key: 'site_id',
                }
            },
            housetype: DataTypes.STRING,
            g99: DataTypes.BOOLEAN,
            mpan: DataTypes.STRING,
            plotAddressId: {
                type: DataTypes.CHAR(36),
                references: {
                    model: 'sn_addresses',
                    key: 'address_id',
                }
            },
            plotApproved: DataTypes.BOOLEAN,
            commissioningFormSubmitted: DataTypes.BOOLEAN,
            importId: {
                type: DataTypes.CHAR(36),
                references: {
                    model: 'sn_import_events',
                    key: 'import_id',
                }
            },
            trackerRef: DataTypes.CHAR(36),
        }, {
            sequelize,
            modelName: 'Plot',
            tableName: 'sn_plots',
            underscored: true,
        });
    }
}

export default Plot;
