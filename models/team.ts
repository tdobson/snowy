import { Model, DataTypes, Sequelize } from 'sequelize';
import { TeamAttributes, TeamCreationAttributes } from '../types/team';

class Team extends Model<TeamAttributes, TeamCreationAttributes> implements TeamAttributes {
    public teamId!: string;
    public instanceId!: string;
    public teamName!: string;
    public teamDescription?: string;
    public importId?: string;

    public static initialize(sequelize: Sequelize): void {
        this.init({
            teamId: {
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
            teamName: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: false
            },
            teamDescription: DataTypes.STRING,
            importId: {
                type: DataTypes.CHAR(36),
                references: {
                    model: 'sn_import_events',
                    key: 'import_id',
                }
            },
        }, {
            sequelize,
            modelName: 'Team',
            tableName: 'sn_teams',
            underscored: true,
        });
    }
}

export default Team;
