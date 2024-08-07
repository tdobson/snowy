import { Model, Optional } from 'sequelize';

export interface DnoDetailAttributes {
  dnoDetailsId: string;
  mpanPrefix: number;
  dnoName: string;
  instanceId: string;
  address?: string;
  emailAddress?: string;
  contactNo?: string;
  internalTel?: string;
  type?: string;
  importId?: string;
}

export interface DnoDetailCreationAttributes extends Optional<DnoDetailAttributes, 'dnoDetailsId'> {}

export interface DnoDetailInstance extends Model<DnoDetailAttributes, DnoDetailCreationAttributes>, DnoDetailAttributes {}
