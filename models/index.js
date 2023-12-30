const Sequelize = require('sequelize');
const config = require('../config/config.json')[process.env.NODE_ENV || 'development'];
const sequelize = require('../config/sequelize');

// Import models
const User = require('./user')(sequelize, Sequelize.DataTypes);
const Client = require('./client')(sequelize, Sequelize.DataTypes);
const Project = require('./project')(sequelize, Sequelize.DataTypes);
const DnoDetail = require('./dnoDetail')(sequelize, Sequelize.DataTypes);
const Region = require('./region')(sequelize, Sequelize.DataTypes);
const Site = require('./site')(sequelize, Sequelize.DataTypes);
const ImportEvent = require('./importEvent')(sequelize, Sequelize.DataTypes);
const Plot = require('./plot')(sequelize, Sequelize.DataTypes);
const PlotSpec = require('./plotSpec')(sequelize, Sequelize.DataTypes);
const PlotInstall = require('./plotInstall')(sequelize, Sequelize.DataTypes);
const McsSubmission = require('./mcsSubmission')(sequelize, Sequelize.DataTypes);
const Job = require('./job')(sequelize, Sequelize.DataTypes);
const Slot = require('./slot')(sequelize, Sequelize.DataTypes);
const Status = require('./status')(sequelize, Sequelize.DataTypes);
const Product = require('./product')(sequelize, Sequelize.DataTypes);
const Address = require('./address')(sequelize, Sequelize.DataTypes);
const FormSubmission = require('./formSubmission')(sequelize, Sequelize.DataTypes);
const Team = require('./team')(sequelize, Sequelize.DataTypes);
const ProjectProcess = require('./projectProcess')(sequelize, Sequelize.DataTypes);

// Define associations
User.hasMany(Project, { foreignKey: 'userId' });
User.hasMany(Job, { foreignKey: 'dispatchedBy' });
User.hasMany(Job, { foreignKey: 'returnedBy' });
User.hasMany(PlotSpec, { foreignKey: 'specifiedBy' });
User.hasMany(PlotInstall, { foreignKey: 'installBy' });
User.hasMany(PlotInstall, { foreignKey: 'checkedBy' });
User.hasMany(McsSubmission, { foreignKey: 'submissionCheckedBy' });
User.hasMany(McsSubmission, { foreignKey: 'submittedBy' });
User.hasMany(ImportEvent, { foreignKey: 'userId' });
User.hasMany(Client, { foreignKey: 'contactId' });
User.hasMany(Site, { foreignKey: 'siteManagerId' });

Client.hasMany(Project, { foreignKey: 'clientId' });

Project.belongsTo(User, { foreignKey: 'userId' });
Project.belongsTo(Client, { foreignKey: 'clientId' });
Project.belongsTo(DnoDetail, { foreignKey: 'dnoDetailsId' });
Project.belongsTo(Region, { foreignKey: 'regionId' });
Project.belongsTo(Site, { foreignKey: 'siteId' });
Project.hasMany(Plot, { foreignKey: 'projectId' });
Project.hasMany(Job, { foreignKey: 'projectId' });
Project.hasOne(ProjectProcess, { foreignKey: 'projectId' });

Plot.belongsTo(Project, { foreignKey: 'projectId' });
Plot.belongsTo(Site, { foreignKey: 'site' });
Plot.belongsTo(Address, { foreignKey: 'plotAddressId' });
Plot.hasMany(PlotSpec, { foreignKey: 'plotId' });
Plot.hasMany(PlotInstall, { foreignKey: 'plotId' });
Plot.hasMany(FormSubmission, { foreignKey: 'plotId' });

// Additional associations based on your schema
// Add here...

module.exports = {
  sequelize,
  Sequelize,
  User,
  Client,
  Project,
  DnoDetail,
  Region,
  Site,
  ImportEvent,
  Plot,
  PlotSpec,
  PlotInstall,
  McsSubmission,
  Job,
  Slot,
  Status,
  Product,
  Address,
  FormSubmission,
  Team,
  ProjectProcess
};
