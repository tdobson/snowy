import { Model, DataTypes, Sequelize } from 'sequelize';
import { PlotInstallAttributes, PlotInstallCreationAttributes } from '../types/plotInstall';

class PlotInstall extends Model<PlotInstallAttributes, PlotInstallCreationAttributes> implements PlotInstallAttributes {
    public plotInstallId!: string;
    public plotId!: string;
    public instanceId!: string;
    public dateInstall?: Date;
    public dateChecked?: Date;
    public installBy?: string;
    public checkedBy?: string;
    public plotInstallStatus!: string;
    public phase?: number;
    public p1?: number;
    public p2?: number;
    public p3?: number;
    public annualYield?: number;
    public kwp?: number;
    public kwpWithLimitation?: number;
    public limiterRequired?: boolean;
    public limiterValueIfNotZero?: number;
    public labourCost?: number;
    public meter?: string;
    public meterCost?: number;
    public battery?: string;
    public batteryCost?: number;
    public overallCost?: number;
    public mcsSubmissionId?: string;
    public importId?: string;

    public static initialize(sequelize: Sequelize): void {
        this.init({
            plotInstallId: {
                type: DataTypes.CHAR(36),
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4
            },
            plotId: {
                type: DataTypes.CHAR(36),
                allowNull: false,
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
            dateInstall: DataTypes.DATE,
            dateChecked: DataTypes.DATE,
            installBy: {
                type: DataTypes.CHAR(36),
                references: {
                    model: 'sn_users',
                    key: 'user_id',
                }
            },
            checkedBy: {
                type: DataTypes.CHAR(36),
                references: {
                    model: 'sn_users',
                    key: 'user_id',
                }
            },
            plotInstallStatus: {
                type: DataTypes.CHAR(36),
                references: {
                    model: 'sn_status',
                    key: 'status_id',
                }
            },
            phase: DataTypes.INTEGER,
            p1: DataTypes.FLOAT,
            p2: DataTypes.FLOAT,
            p3: DataTypes.FLOAT,
            annualYield: DataTypes.FLOAT,
            kwp: DataTypes.FLOAT,
            kwpWithLimitation: DataTypes.FLOAT,
            limiterRequired: DataTypes.BOOLEAN,
            limiterValueIfNotZero: DataTypes.FLOAT,
            labourCost: DataTypes.FLOAT,
            meter: {
                type: DataTypes.CHAR(36),
                references: {
                    model: 'sn_products',
                    key: 'product_id',
                }
            },
            meterCost: DataTypes.FLOAT,
            battery: {
                type: DataTypes.CHAR(36),
                references: {
                    model: 'sn_products',
                    key: 'product_id',
                }
            },
            batteryCost: DataTypes.FLOAT,
            overallCost: DataTypes.FLOAT,
            mcsSubmissionId: {
                type: DataTypes.CHAR(36),
                references: {
                    model: 'sn_mcs_submission',
                    key: 'mcs_submission_id',
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
            modelName: 'PlotInstall',
            tableName: 'sn_plot_install',
            underscored: true,
        });
    }
}

export default PlotInstall;
