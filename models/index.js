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
const Elevation = require('./elevation')(sequelize, Sequelize.DataTypes);
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

// User associations

// todo - to review


User.hasMany(ImportEvent, { foreignKey: 'importedBy' });
User.hasMany(ImportEvent, { foreignKey: 'modifiedBy' });
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
User.hasOne(Address, { foreignKey: 'userAddressId' });

// Client associations
Client.hasMany(Project, { foreignKey: 'clientId' });
Client.belongsTo(User, { foreignKey: 'contactId' });
Client.hasOne(Address, { foreignKey: 'userAddressId' });


// Project associations
Project.belongsTo(Client, { foreignKey: 'clientId' });
Project.belongsTo(User, { foreignKey: 'userId' });
Project.belongsTo(DnoDetail, { foreignKey: 'dnoDetailsId' }); // Is this right?
Project.belongsTo(Region, { foreignKey: 'regionId' });
Project.hasOne(Site, { foreignKey: 'siteId' });
Project.hasMany(Plot, { foreignKey: 'projectId' });
Project.hasMany(Job, { foreignKey: 'projectId' });
Project.hasOne(ProjectProcess, { foreignKey: 'projectId' });

// DnoDetail associations
DnoDetail.hasOne(ImportEvent, { foreignKey: 'importId' });

// Region associations
Region.hasOne(ImportEvent, { foreignKey: 'importId' });

// Site associations
Site.hasOne(Address, { foreignKey: 'siteAddressId' });
Site.belongsTo(User, { foreignKey: 'siteManagerId' });
Site.hasMany(Project, { foreignKey: 'projectId' });
Site.hasOne(DnoDetail, { foreignKey: 'dnoDetailsId' });

// ImportEvent associations
ImportEvent.belongsTo(User, { foreignKey: 'importedBy' });
ImportEvent.belongsTo(User, { foreignKey: 'modifiedBy' });
ImportEvent.belongsTo(Project, { foreignKey: 'projectId' });
ImportEvent.belongsTo(Plot, { foreignKey: 'plotId' });
// ... and so on for other entities

// Plot associations
Plot.belongsTo(Project, { foreignKey: 'projectId' });
Plot.belongsTo(Site, { foreignKey: 'site' });
Plot.hasMany(PlotSpec, { foreignKey: 'plotId' });
Plot.hasMany(PlotInstall, { foreignKey: 'plotId' });
Plot.hasMany(FormSubmission, { foreignKey: 'plotId' });

// PlotSpec associations
PlotSpec.belongsTo(User, { foreignKey: 'specifiedBy' });
PlotSpec.belongsTo(Plot, { foreignKey: 'plotId' });
PlotSpec.hasOne(Status, { foreignKey: 'plotSpecStatus' });
PlotSpec.hasOne(Product, { foreignKey: 'meter' });
PlotSpec.hasOne(Product, { foreignKey: 'battery' });
PlotSpec.hasMany(Elevation, { foreignKey: 'plot_ref_id' });


// PlotInstall associations
PlotInstall.belongsTo(User, { foreignKey: 'installBy' });
PlotInstall.belongsTo(User, { foreignKey: 'checkedBy' });
PlotInstall.belongsTo(Plot, { foreignKey: 'plotId' });
PlotInstall.hasOne(Status, { foreignKey: 'plotInstallStatus' });
PlotInstall.hasOne(Product, { foreignKey: 'meter' });
PlotInstall.hasOne(Product, { foreignKey: 'battery' });
PlotInstall.hasMany(McsSubmission, { foreignKey: 'mcsSubmissionId' });
PlotInstall.hasMany(Elevation, { foreignKey: 'plot_ref_id' });


// Elevation associations
Elevation.hasOne(Product, { foreignKey: 'inverter' });
Elevation.hasOne(Product, { foreignKey: 'panel' });
Elevation.hasOne(Product, { foreignKey: 'roofKit' });




// FormSubmission associations
FormSubmission.belongsTo(Plot, { foreignKey: 'plotId' });
FormSubmission.belongsTo(Job, { foreignKey: 'jobId' });

// Job associations
Job.belongsTo(Plot, { foreignKey: 'plotId' });
Job.belongsTo(Project, { foreignKey: 'projectId' });
Job.belongsTo(User, { foreignKey: 'dispatchedBy' });
Job.belongsTo(User, { foreignKey: 'returnedBy' });
Job.belongsTo(Status, { foreignKey: 'jobStatus' });
Job.belongsTo(User, { foreignKey: 'userId' });
Job.belongsTo(Slot, { foreignKey: 'slotId' });
Job.belongsTo(Team, { foreignKey: 'dispatchTeam' });

// Slot associations
Slot.belongsTo(Job, { foreignKey: 'jobId' });

// Address associations
Address.belongsTo(Region, { foreignKey: 'addressRegionId' });

// Product associations
Product.belongsTo(ImportEvent, { foreignKey: 'importId' });

// McsSubmission associations
McsSubmission.belongsTo(User, { foreignKey: 'submissionCheckedBy' });
McsSubmission.belongsTo(User, { foreignKey: 'submittedBy' });
McsSubmission.belongsTo(Status, { foreignKey: 'mcsSubmitStatus' });


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
