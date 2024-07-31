import { Model, Optional } from 'sequelize';

interface AddressAttributes {
  addressId: string;
  addressLine1?: string;
  addressLine2?: string;
  addressTown?: string;
  addressCounty?: string;
  addressPostcode?: string;
  addressCountry?: string;
  instanceId: string;
  addressRegionId?: string;
  importId?: string;
}

interface AddressCreationAttributes extends Optional<AddressAttributes, 'addressId'> {}

export interface AddressInstance extends Model<AddressAttributes, AddressCreationAttributes>, AddressAttributes {}
import { Model } from 'sequelize';

export interface AddressAttributes {
  addressId: string;
  addressLine1?: string;
  addressLine2?: string;
  addressTown?: string;
  addressCounty?: string;
  addressPostcode?: string;
  addressCountry?: string;
  instanceId: string;
  addressRegionId?: string;
  importId?: string;
}

export interface AddressCreationAttributes extends Omit<AddressAttributes, 'addressId'> {}

export interface AddressInstance
  extends Model<AddressAttributes, AddressCreationAttributes>,
    AddressAttributes {}
import { Model, Optional } from 'sequelize';

interface AddressAttributes {
  addressId: string;
  addressLine1?: string;
  addressLine2?: string;
  addressTown?: string;
  addressCounty?: string;
  addressPostcode?: string;
  addressCountry?: string;
  instanceId: string;
  addressRegionId?: string;
  importId?: string;
}

interface AddressCreationAttributes extends Optional<AddressAttributes, 'addressId'> {}

export interface AddressInstance extends Model<AddressAttributes, AddressCreationAttributes>, AddressAttributes {}
