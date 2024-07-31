import { Model, Optional } from 'sequelize';

export interface SiteAttributes {
    siteId: string;
    instanceId: string;
    siteName?: string;
    projectId?: string;
    dnoDetailsId?: string;
    siteAddressId?: string;
    siteManagerId?: string;
    importId?: string;
}

export interface SiteCreationAttributes extends Optional<SiteAttributes, 'siteId'> {}

export interface SiteInstance extends Model<SiteAttributes, SiteCreationAttributes>, SiteAttributes {}
