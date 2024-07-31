import { Model, DataTypes, Sequelize } from 'sequelize';
import { ClientAttributes, ClientCreationAttributes } from '../types/client';

class Client extends Model<ClientAttributes, ClientCreationAttributes> implements ClientAttributes {
    public clientId!: string;
    public instanceId!: string;
    public clientLegacyNumber?: string;
    public clientName!: string;
    public clientAddressId?: string;
    public clientPlotCardRequired?: string;
    public contactId?: string;
    public importId?: string;

    public static initialize(sequelize: Sequelize) {
        this.init({
            clientId: {
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
            clientLegacyNumber: DataTypes.STRING,
            clientName: {
                type: DataTypes.STRING,
                allowNull: false
            },
            clientAddressId: {
                type: DataTypes.CHAR(36),
                references: {
                    model: 'sn_addresses',
                    key: 'address_id',
                }
            },
            clientPlotCardRequired: DataTypes.STRING,
            contactId: {
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
            modelName: 'Client',
            tableName: 'sn_clients',
            underscored: true,
        });
    }
}

export default Client;
