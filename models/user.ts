import { Model, DataTypes, Sequelize } from 'sequelize';
import { UserAttributes, UserCreationAttributes } from '../types/user';

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    public userId!: string;
    public instanceId!: string;
    public ssoId?: string;
    public name!: string;
    public email!: string;
    public password?: string;
    public phone?: string;
    public employer?: string;
    public teamId?: string;
    public resetToken?: string;
    public resetTokenExpires?: Date;
    public dispatchId?: string;
    public snowyRole!: string;
    public companyRole?: string;
    public categoryId?: string;
    public userAddressId?: string;
    public importId?: string;

    public static initialize(sequelize: Sequelize): void {
        this.init({
            userId: {
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
            ssoId: DataTypes.STRING(255),
            name: {
                type: DataTypes.STRING(255),
                allowNull: false
            },
            email: {
                type: DataTypes.STRING(255),
                allowNull: false,
                unique: true
            },
            password: {
                type: DataTypes.STRING(255)
            },
            phone: DataTypes.STRING(255),
            employer: DataTypes.STRING(255),
            teamId: {
                type: DataTypes.CHAR(36),
                references: {
                    model: 'sn_teams',
                    key: 'team_id',
                }
            },
            resetToken: {
                type: DataTypes.STRING,
                allowNull: true
            },
            resetTokenExpires: {
                type: DataTypes.DATE,
                allowNull: true
            },
            dispatchId: DataTypes.STRING(255),
            snowyRole: {
                type: DataTypes.STRING(255),
                allowNull: false
            },
            companyRole: DataTypes.STRING(255),
            categoryId: DataTypes.CHAR(36),
            userAddressId: {
                type: DataTypes.CHAR(36),
                references: {
                    model: 'sn_addresses',
                    key: 'address_id',
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
            modelName: 'User',
            tableName: 'sn_users',
            underscored: true,
        });
    }
}

export default User;
import { Model, DataTypes, Sequelize } from 'sequelize';

export interface UserAttributes {
  userId: string;
  email: string;
  password: string;
  resetToken?: string;
  resetTokenExpires?: Date;
  // Add other user attributes here
}

export interface UserCreationAttributes extends Omit<UserAttributes, 'userId'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public userId!: string;
  public email!: string;
  public password!: string;
  public resetToken?: string;
  public resetTokenExpires?: Date;

  public static initialize(sequelize: Sequelize) {
    this.init(
      {
        userId: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        resetToken: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        resetTokenExpires: {
          type: DataTypes.DATE,
          allowNull: true,
        },
      },
      {
        sequelize,
        modelName: 'User',
        tableName: 'users',
        underscored: true,
      }
    );
  }
}

export default User;
