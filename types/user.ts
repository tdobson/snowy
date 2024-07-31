import { Model, Optional } from 'sequelize';

export interface UserAttributes {
    userId: string;
    instanceId: string;
    ssoId?: string;
    name: string;
    email: string;
    password?: string;
    phone?: string;
    employer?: string;
    teamId?: string;
    resetToken?: string;
    resetTokenExpires?: Date;
    dispatchId?: string;
    snowyRole: string;
    companyRole?: string;
    categoryId?: string;
    userAddressId?: string;
    importId?: string;
}

export interface UserCreationAttributes extends Optional<UserAttributes, 'userId'> {}

export interface UserInstance extends Model<UserAttributes, UserCreationAttributes>, UserAttributes {}
