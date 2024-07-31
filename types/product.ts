import { Model, Optional } from 'sequelize';

export interface ProductAttributes {
    productId: string;
    instanceId: string;
    productType?: string;
    manufacturer?: string;
    productModel?: string;
    productName?: string;
    kwp?: number;
    voc?: number;
    isc?: number;
    type?: string;
    capacity?: number;
    noPhases?: number;
    modelRef?: string;
    costToday?: number;
    mcsProductReference?: string;
    mcsProductId?: string;
    importId?: string;
}

export interface ProductCreationAttributes extends Optional<ProductAttributes, 'productId'> {}

export interface ProductInstance extends Model<ProductAttributes, ProductCreationAttributes>, ProductAttributes {}
