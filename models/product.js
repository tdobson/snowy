// ./models/product.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

class Product extends Model {}

Product.init({
    productId: {
        type: DataTypes.CHAR(36),
        primaryKey: true,
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
            model: 'sn_import_events', // Ensure this matches your import events table name
            key: 'import_id',
        }
    },
    // Additional fields can be added here as necessary
}, {
    sequelize,
    modelName: 'Product',
    tableName: 'sn_products'
});

module.exports = Product;
