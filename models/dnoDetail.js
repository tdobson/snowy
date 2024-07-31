// ./models/dnoDetail.js
import { Model, DataTypes } from 'sequelize';
import { DnoDetailInstance, DnoDetailAttributes } from '../types/dnoDetail';
import sequelize from '../config/sequelize';

class DnoDetail extends Model<DnoDetailAttributes, Omit<DnoDetailAttributes, 'dnoDetailsId'>> implements DnoDetailInstance {
  public dnoDetailsId!: string;
  public mpanPrefix!: number;
  public dnoName!: string;
  public instanceId!: string;
  public address?: string;
  public emailAddress?: string;
  public contactNo?: string;
  public internalTel?: string;
  public type?: string;
  public importId?: string;
}

DnoDetail.init(
  {
    dnoDetailsId: {
      type: DataTypes.CHAR(36),
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    mpanPrefix: {
      type: DataTypes.INTEGER,
      unique: true,
      allowNull: false,
    },
    dnoName: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    instanceId: {
      type: DataTypes.CHAR(36),
      references: {
        model: 'sn_instances',
        key: 'instance_id',
      },
    },
    address: DataTypes.STRING,
    emailAddress: DataTypes.STRING,
    contactNo: DataTypes.STRING,
    internalTel: DataTypes.STRING,
    type: DataTypes.STRING,
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
    modelName: 'DnoDetail',
    tableName: 'sn_dno_details',
    underscored: true,
  }
);

export default DnoDetail;
