import { Model, DataTypes, Sequelize } from 'sequelize';
import { RegionAttributes, RegionCreationAttributes } from '../types/region';

class Region extends Model<RegionAttributes, RegionCreationAttributes> implements RegionAttributes {
    public regionId!: string;
    public regionNumber!: string;
    public instanceId!: string;
    public regionName?: string;
    public importId?: string;

    public static initialize(sequelize: Sequelize): void {
        this.init({
            regionId: {
                type: DataTypes.CHAR(36),
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
            },
            regionNumber: {
                type: DataTypes.CHAR(10),
                unique: true,
                allowNull: false
            },
            instanceId: {
                type: DataTypes.CHAR(36),
                references: {
                    model: 'sn_instances',
                    key: 'instance_id',
                }
            },
            regionName: DataTypes.STRING,
            importId: {
                type: DataTypes.CHAR(36),
                references: {
                    model: 'sn_import_events',
                    key: 'import_id',
                }
            },
        }, {
            sequelize,
            modelName: 'Region',
            tableName: 'sn_region',
            underscored: true,
        });
    }
}

export default Region;
