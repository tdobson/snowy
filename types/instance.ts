import { Model, Optional } from 'sequelize';

export interface InstanceAttributes {
    instanceId: string;
    instanceNameKey: string;
    instanceName: string;
    instanceDescription?: string;
    instanceLogoUrl?: string;
    instanceKeyContact?: string;
    importId?: string;
}

export interface InstanceCreationAttributes extends Optional<InstanceAttributes, 'instanceId'> {}

export interface InstanceInstance extends Model<InstanceAttributes, InstanceCreationAttributes>, InstanceAttributes {}
