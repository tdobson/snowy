import { Model, Optional } from 'sequelize';

export interface RegionAttributes {
    regionId: string;
    regionNumber: string;
    instanceId: string;
    regionName?: string;
    importId?: string;
}

export interface RegionCreationAttributes extends Optional<RegionAttributes, 'regionId'> {}

export interface RegionInstance extends Model<RegionAttributes, RegionCreationAttributes>, RegionAttributes {}
