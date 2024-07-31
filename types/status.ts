import { Model, Optional } from 'sequelize';

export interface StatusAttributes {
    statusId: string;
    instanceId: string;
    statusState: string;
    statusName: string;
    statusGroup: string;
    statusCode?: string;
    statusDescription?: string;
    importId?: string;
}

export interface StatusCreationAttributes extends Optional<StatusAttributes, 'statusId'> {}

export interface StatusInstance extends Model<StatusAttributes, StatusCreationAttributes>, StatusAttributes {}
