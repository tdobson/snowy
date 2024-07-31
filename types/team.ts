import { Model, Optional } from 'sequelize';

export interface TeamAttributes {
    teamId: string;
    instanceId: string;
    teamName: string;
    teamDescription?: string;
    importId?: string;
}

export interface TeamCreationAttributes extends Optional<TeamAttributes, 'teamId'> {}

export interface TeamInstance extends Model<TeamAttributes, TeamCreationAttributes>, TeamAttributes {}
