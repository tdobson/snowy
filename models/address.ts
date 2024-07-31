// ./models/address.ts
import { Model, DataTypes, Sequelize } from 'sequelize';
import { AddressAttributes, AddressCreationAttributes } from '../types/address';

class Address extends Model<AddressAttributes, AddressCreationAttributes> implements AddressAttributes {
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

    public static initialize(sequelize: Sequelize) {
        this.init(
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
                        model: 'sn_region',
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
    }
}

export default Address;
