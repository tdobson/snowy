// ./models/team.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

class Team extends Model {}

Team.init({
    teamId: {
        type: DataTypes.CHAR(36),
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    teamName: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    teamDescription: DataTypes.STRING,
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
    modelName: 'Team',
    tableName: 'sn_teams',
    underscored: true,
});

module.exports = Team;
