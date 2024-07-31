// ./models/address.js
// ./models/address.ts
import { Model, DataTypes } from 'sequelize';
import { AddressInstance, AddressAttributes } from '../types/address';
import sequelize from '../config/sequelize';

class Address extends Model<AddressAttributes, Omit<AddressAttributes, 'addressId'>> implements AddressInstance {
  public addressId!: string;
  public addressLine1?: string;
  public addressLine2?: string;
  public addressTown?: string;
  public addressCounty?: string;
  public addressPostcode?: string;
  public addressCountry?: string;
  public instanceId!: string;
  public addressRegionId?: string;
  public importId?: string;
}

Address.init(
  {
    addressId: {
      type: DataTypes.CHAR(36),
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    addressLine1: DataTypes.STRING,
    addressLine2: DataTypes.STRING,
    addressTown: DataTypes.STRING,
    addressCounty: DataTypes.STRING,
    addressPostcode: DataTypes.STRING,
    addressCountry: DataTypes.STRING,
    instanceId: {
      type: DataTypes.CHAR(36),
      references: {
        model: 'sn_instances',
        key: 'instance_id',
      },
    },
    addressRegionId: {
      type: DataTypes.CHAR(36),
      references: {
        model: 'sn_regions',
        key: 'region_id',
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
    modelName: 'Address',
    tableName: 'sn_addresses',
    underscored: true,
  }
);

export default Address;
