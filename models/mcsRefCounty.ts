import { Model, DataTypes, Sequelize } from 'sequelize';
import { McsRefCountyAttributes, McsRefCountyCreationAttributes } from '../types/mcsRefCounty';

class McsRefCounty extends Model<McsRefCountyAttributes, McsRefCountyCreationAttributes> implements McsRefCountyAttributes {
    public mcsCountyId!: string;
    public mcsCountyName!: string;
    public mcsApiCountyId!: number;
    public importId?: string;

    public static initialize(sequelize: Sequelize): void {
        this.init({
            mcsCountyId: {
                type: DataTypes.CHAR(36),
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4
            },
            mcsCountyName: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: false
            },
            mcsApiCountyId: {
                type: DataTypes.INTEGER,
                allowNull: false
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
            modelName: 'McsRefCounty',
            tableName: 'sn_mcs_ref_counties',
            underscored: true,
        });
    }
}

export default McsRefCounty;
