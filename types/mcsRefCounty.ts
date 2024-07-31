import { Model, Optional } from 'sequelize';

export interface McsRefCountyAttributes {
    mcsCountyId: string;
    mcsCountyName: string;
    mcsApiCountyId: number;
    importId?: string;
}

export interface McsRefCountyCreationAttributes extends Optional<McsRefCountyAttributes, 'mcsCountyId'> {}

export interface McsRefCountyInstance extends Model<McsRefCountyAttributes, McsRefCountyCreationAttributes>, McsRefCountyAttributes {}
