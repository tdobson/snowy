import { Model, DataTypes, Sequelize } from 'sequelize';
import { ImportEventAttributes, ImportEventCreationAttributes } from '../types/importEvent';

class ImportEvent extends Model<ImportEventAttributes, ImportEventCreationAttributes> implements ImportEventAttributes {
    public importId!: string;
    public instanceId!: string;
    public importDate!: Date;
    public importedBy!: string;
    public modifiedDate!: Date;
    public modifiedBy!: string;
    public modificationRef?: string;
    public importRef?: string;
    public importSource?: string;
    public importNotes?: string;

    public static initialize(sequelize: Sequelize): void {
        this.init({
            importId: {
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
            importDate: {
                type: DataTypes.DATE,
                allowNull: false
            },
            importedBy: {
                type: DataTypes.CHAR(36),
                references: {
                    model: 'sn_users',
                    key: 'user_id',
                }
            },
            modifiedDate: {
                type: DataTypes.DATE,
                allowNull: false
            },
            modifiedBy: {
                type: DataTypes.CHAR(36),
                references: {
                    model: 'sn_users',
                    key: 'user_id',
                }
            },
            modificationRef: DataTypes.STRING,
            importRef: DataTypes.STRING,
            importSource: DataTypes.STRING,
            importNotes: DataTypes.TEXT,
        }, {
            sequelize,
            modelName: 'ImportEvent',
            tableName: 'sn_import_events',
            underscored: true,
        });
    }
}

export default ImportEvent;
