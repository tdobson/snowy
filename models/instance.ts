import { Model, DataTypes, Sequelize } from 'sequelize';
import { InstanceAttributes, InstanceCreationAttributes } from '../types/instance';

class Instance extends Model<InstanceAttributes, InstanceCreationAttributes> implements InstanceAttributes {
    public instanceId!: string;
    public instanceNameKey!: string;
    public instanceName!: string;
    public instanceDescription?: string;
    public instanceLogoUrl?: string;
    public instanceKeyContact?: string;
    public importId?: string;

    public static initialize(sequelize: Sequelize): void {
        this.init({
            instanceId: {
                type: DataTypes.CHAR(36),
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4
            },
            instanceNameKey: {
                type: DataTypes.STRING(255),
                allowNull: false,
                unique: true
            },
            instanceName: {
                type: DataTypes.STRING(255),
                allowNull: false
            },
            instanceDescription: DataTypes.STRING(255),
            instanceLogoUrl: DataTypes.STRING(255),
            instanceKeyContact: {
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
            modelName: 'Instance',
            tableName: 'sn_instances',
            underscored: true,
        });
    }
}

export default Instance;
