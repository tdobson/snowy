import { Model, DataTypes, Sequelize } from 'sequelize';
import { PlotSpecAttributes, PlotSpecCreationAttributes } from '../types/plotSpec';

class PlotSpec extends Model<PlotSpecAttributes, PlotSpecCreationAttributes> implements PlotSpecAttributes {
    public plotSpecId!: string;
    public plotId!: string;
    public instanceId!: string;
    public dateSpecified?: Date;
    public specifiedBy?: string;
    public plotSpecStatus!: string;
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
    public landlordSupply?: boolean;
    public importId?: string;

    public static initialize(sequelize: Sequelize): void {
        this.init({
            plotSpecId: {
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
            dateSpecified: DataTypes.DATE,
            specifiedBy: {
                type: DataTypes.CHAR(36),
                references: {
                    model: 'sn_users',
                    key: 'user_id',
                }
            },
            plotSpecStatus: {
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
            landlordSupply: DataTypes.BOOLEAN,
            importId: {
                type: DataTypes.CHAR(36),
                references: {
                    model: 'sn_import_events',
                    key: 'import_id',
                }
            },
        }, {
            sequelize,
            modelName: 'PlotSpec',
            tableName: 'sn_plot_spec',
            underscored: true,
        });
    }
}

export default PlotSpec;
