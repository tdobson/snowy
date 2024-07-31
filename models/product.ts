import { Model, DataTypes, Sequelize } from 'sequelize';
import { ProductAttributes, ProductCreationAttributes } from '../types/product';

class Product extends Model<ProductAttributes, ProductCreationAttributes> implements ProductAttributes {
    public productId!: string;
    public instanceId!: string;
    public productType?: string;
    public manufacturer?: string;
    public productModel?: string;
    public productName?: string;
    public kwp?: number;
    public voc?: number;
    public isc?: number;
    public type?: string;
    public capacity?: number;
    public noPhases?: number;
    public modelRef?: string;
    public costToday?: number;
    public mcsProductReference?: string;
    public mcsProductId?: string;
    public importId?: string;

    public static initialize(sequelize: Sequelize): void {
        this.init({
            productId: {
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
            productType: DataTypes.STRING,
            manufacturer: DataTypes.STRING,
            productModel: DataTypes.STRING,
            productName: DataTypes.STRING,
            kwp: DataTypes.FLOAT,
            voc: DataTypes.FLOAT,
            isc: DataTypes.FLOAT,
            type: DataTypes.STRING,
            capacity: DataTypes.FLOAT,
            noPhases: DataTypes.INTEGER,
            modelRef: DataTypes.STRING,
            costToday: DataTypes.FLOAT,
            mcsProductReference: DataTypes.STRING,
            mcsProductId: DataTypes.STRING,
            importId: {
                type: DataTypes.CHAR(36),
                references: {
                    model: 'sn_import_events',
                    key: 'import_id',
                }
            },
        }, {
            sequelize,
            modelName: 'Product',
            tableName: 'sn_products',
            underscored: true,
        });
    }
}

export default Product;
