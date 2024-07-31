import { Model, DataTypes, Sequelize } from 'sequelize';
import { SiteAttributes, SiteCreationAttributes } from '../types/site';

class Site extends Model<SiteAttributes, SiteCreationAttributes> implements SiteAttributes {
    public siteId!: string;
    public instanceId!: string;
    public siteName?: string;
    public projectId?: string;
    public dnoDetailsId?: string;
    public siteAddressId?: string;
    public siteManagerId?: string;
    public importId?: string;

    public static initialize(sequelize: Sequelize): void {
        this.init({
            siteId: {
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
            siteName: {
                type: DataTypes.STRING(255),
            },
            projectId: {
                type: DataTypes.CHAR(36),
                references: {
                    model: 'sn_projects',
                    key: 'project_id',
                }
            },
            dnoDetailsId: {
                type: DataTypes.CHAR(36),
                references: {
                    model: 'sn_dno_details',
                    key: 'dno_details_id',
                }
            },
            siteAddressId: {
                type: DataTypes.CHAR(36),
                references: {
                    model: 'sn_addresses',
                    key: 'address_id',
                }
            },
            siteManagerId: {
                type: DataTypes.CHAR(36),
                references: {
                    model: 'sn_users',
                    key: 'user_id',
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
            modelName: 'Site',
            tableName: 'sn_sites',
            underscored: true,
        });
    }
}

export default Site;
