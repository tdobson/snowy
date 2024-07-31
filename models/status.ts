import { Model, DataTypes, Sequelize } from 'sequelize';
import { StatusAttributes, StatusCreationAttributes } from '../types/status';

class Status extends Model<StatusAttributes, StatusCreationAttributes> implements StatusAttributes {
    public statusId!: string;
    public instanceId!: string;
    public statusState!: string;
    public statusName!: string;
    public statusGroup!: string;
    public statusCode?: string;
    public statusDescription?: string;
    public importId?: string;

    public static initialize(sequelize: Sequelize): void {
        this.init({
            statusId: {
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
            statusState: {
                type: DataTypes.STRING(255),
                allowNull: false
            },
            statusName: {
                type: DataTypes.STRING(255),
                allowNull: false
            },
            statusGroup: {
                type: DataTypes.STRING(255),
                allowNull: false
            },
            statusCode: DataTypes.STRING(255),
            statusDescription: DataTypes.STRING(510),
            importId: {
                type: DataTypes.CHAR(36),
                references: {
                    model: 'sn_import_events',
                    key: 'import_id',
                }
            },
        }, {
            sequelize,
            modelName: 'Status',
            tableName: 'sn_status',
            underscored: true,
        });
    }
}

export default Status;
