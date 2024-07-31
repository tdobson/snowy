import { Model, DataTypes, Sequelize } from 'sequelize';
import { ElevationSpecAttributes, ElevationSpecCreationAttributes } from '../types/elevationSpec';

class ElevationSpec extends Model<ElevationSpecAttributes, ElevationSpecCreationAttributes> implements ElevationSpecAttributes {
    public elevationSpecId!: string;
    public plotSpecId!: string;
    public plotId!: string;
    public instanceId!: string;
    public typeTestRef?: string;
    public pitch?: number;
    public orientation?: string;
    public kkFigure?: number;
    public kwp?: number;
    public strings?: number;
    public moduleQty?: number;
    public inverter?: string;
    public inverterCost?: number;
    public panel?: string;
    public panelCost?: number;
    public panelsTotalCost?: number;
    public roofKit?: string;
    public roofKitCost?: number;
    public annualYield?: number;
    public importId?: string;

    public static initialize(sequelize: Sequelize): void {
        this.init({
            elevationSpecId: {
                type: DataTypes.CHAR(36),
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4
            },
            plotSpecId: {
                type: DataTypes.CHAR(36),
                references: {
                    model: 'sn_plot_install',
                    key: 'plot_spec_id',
                }
            },
            plotId: {
                type: DataTypes.CHAR(36),
                allowNull: false
            },
            instanceId: {
                type: DataTypes.CHAR(36),
                references: {
                    model: 'sn_instances',
                    key: 'instance_id',
                }
            },
            typeTestRef: DataTypes.STRING(255),
            pitch: DataTypes.FLOAT,
            orientation: DataTypes.STRING(255),
            kkFigure: DataTypes.FLOAT,
            kwp: DataTypes.FLOAT,
            strings: DataTypes.INTEGER,
            moduleQty: DataTypes.INTEGER,
            inverter: {
                type: DataTypes.STRING(255),
                references: {
                    model: 'sn_products',
                    key: 'product_id',
                }
            },
            inverterCost: DataTypes.FLOAT,
            panel: {
                type: DataTypes.STRING(255),
                references: {
                    model: 'sn_products',
                    key: 'product_id',
                }
            },
            panelCost: DataTypes.FLOAT,
            panelsTotalCost: DataTypes.FLOAT,
            roofKit: {
                type: DataTypes.STRING(255),
                references: {
                    model: 'sn_products',
                    key: 'product_id',
                }
            },
            roofKitCost: DataTypes.FLOAT,
            annualYield: DataTypes.FLOAT,
            importId: {
                type: DataTypes.CHAR(36),
                references: {
                    model: 'sn_import_events',
                    key: 'import_id',
                }
            },
        }, {
            sequelize,
            modelName: 'ElevationSpec',
            tableName: 'sn_elevations_spec',
            underscored: true,
        });
    }
}

export default ElevationSpec;
