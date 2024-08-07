import { Model, DataTypes, Sequelize } from 'sequelize';
import { SlotAttributes, SlotCreationAttributes } from '../types/slot';

class Slot extends Model<SlotAttributes, SlotCreationAttributes> implements SlotAttributes {
    public slotId!: string;
    public instanceId!: string;
    public date!: Date;
    public locationSlot!: string;
    public timeSlot!: string;
    public jobId?: string;
    public importId?: string;

    public static initialize(sequelize: Sequelize): void {
        this.init({
            slotId: {
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
            date: {
                type: DataTypes.DATE,
                allowNull: false
            },
            locationSlot: {
                type: DataTypes.CHAR(255),
                allowNull: true
            },
            timeSlot: {
                type: DataTypes.CHAR(255),
                allowNull: true
            },
            jobId: {
                type: DataTypes.CHAR(36),
                references: {
                    model: 'sn_jobs',
                    key: 'job_id',
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
            modelName: 'Slot',
            tableName: 'sn_slots',
            underscored: true,
        });
    }
}

export default Slot;
