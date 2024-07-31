import { Model, Optional } from 'sequelize';

export interface SlotAttributes {
    slotId: string;
    instanceId: string;
    date: Date;
    locationSlot: number;
    timeSlot: number;
    jobId?: string;
    importId?: string;
}

export interface SlotCreationAttributes extends Optional<SlotAttributes, 'slotId'> {}

export interface SlotInstance extends Model<SlotAttributes, SlotCreationAttributes>, SlotAttributes {}
