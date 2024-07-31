// ./models/client.js
import { Model, DataTypes } from 'sequelize';
import { ClientInstance, ClientAttributes } from '../types/client';
import sequelize from '../config/sequelize';

class Client extends Model<ClientAttributes, Omit<ClientAttributes, 'clientId'>> implements ClientInstance {
  public clientId!: string;
  public instanceId!: string;
  public clientLegacyNumber?: string;
  public clientName!: string;
  public clientAddressId?: string;
  public clientPlotCardRequired?: string;
  public contactId?: string;
  public importId?: string;
}

Client.init(
  {
    clientId: {
      type: DataTypes.CHAR(36),
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    instanceId: {
      type: DataTypes.CHAR(36),
      references: {
        model: 'sn_instances',
        key: 'instance_id',
      },
    },
    clientLegacyNumber: DataTypes.STRING(255),
    clientName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    clientAddressId: {
      type: DataTypes.CHAR(36),
      references: {
        model: 'sn_addresses',
        key: 'address_id',
      },
    },
    clientPlotCardRequired: DataTypes.STRING(255),
    contactId: {
      type: DataTypes.CHAR(36),
      references: {
        model: 'sn_users',
        key: 'user_id',
      },
    },
    importId: {
      type: DataTypes.CHAR(36),
      references: {
        model: 'sn_import_events',
        key: 'import_id',
      },
    },
  },
  {
    sequelize,
    modelName: 'Client',
    tableName: 'sn_clients',
    underscored: true,
  }
);

export default Client;
