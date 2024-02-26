const Sequelize = require('sequelize');
const config = require('../config/config.json')[process.env.NODE_ENV || 'development'];
const sequelize = new Sequelize(config.database, config.username, config.password, config);

// Import models
const Address = require('./address');
const Client = require('./client');
const DnoDetail = require('./dnoDetail');
const ElevationInstall = require('./elevationInstall');
const ElevationSpec = require('./elevationSpec');
const FormSubmission = require('./formSubmission');
const ImportEvent = require('./importEvent');
const Job = require('./job');
const McsRefCounty = require('./mcsRefCounty');
const McsSubmission = require('./mcsSubmission');
const Plot = require('./plot');
const PlotInstall = require('./plotInstall');
const PlotSpec = require('./plotSpec');
const Product = require('./product');
const Project = require('./project');
const ProjectProcess = require('./projectProcess');
const Region = require('./region');
const Site = require('./site');
const Slot = require('./slot');
const Status = require('./status');
const Team = require('./team');
const User = require('./user');

// Address associations
Address.hasMany(Site, { foreignKey: 'siteAddressId' });
Address.hasMany(Client, { foreignKey: 'clientAddressId' });
Address.hasMany(Plot, { foreignKey: 'plotAddressId' });
Address.belongsTo(Region, { foreignKey: 'addressRegionId' });
Address.belongsTo(User, { foreignKey: 'userAddressId' });

// Client associations
Client.hasMany(Project, { foreignKey: 'clientId' });
Client.belongsTo(Address, { foreignKey: 'clientAddressId' });
Client.belongsTo(User, { as: 'ContactPerson', foreignKey: 'contactId' });

// DnoDetail associations
DnoDetail.hasMany(Project, { foreignKey: 'dnoDetailsId' });
DnoDetail.hasMany(Site, { foreignKey: 'dnoDetailsId' });

// ElevationInstall associations
ElevationInstall.belongsTo(PlotInstall, { foreignKey: 'plotInstallId' });
ElevationInstall.belongsTo(Plot, { foreignKey: 'plotId' }); // Optional, based on your model structure
ElevationInstall.belongsTo(Product, { as: 'Inverter', foreignKey: 'inverter' });
ElevationInstall.belongsTo(Product, { as: 'Panel', foreignKey: 'panel' });
ElevationInstall.belongsTo(Product, { as: 'RoofKit', foreignKey: 'roofKit' });

// ElevationSpec associations
ElevationSpec.belongsTo(PlotSpec, { foreignKey: 'plotSpecId' });
ElevationSpec.belongsTo(Plot, { foreignKey: 'plotId' }); // Optional, based on your model structure
ElevationSpec.belongsTo(Product, { as: 'Inverter', foreignKey: 'inverter' });
ElevationSpec.belongsTo(Product, { as: 'Panel', foreignKey: 'panel' });
ElevationSpec.belongsTo(Product, { as: 'RoofKit', foreignKey: 'roofKit' });

// FormSubmission associations
FormSubmission.belongsTo(Plot, { foreignKey: 'plotId' });
FormSubmission.belongsTo(Job, { foreignKey: 'jobId' });

// ImportEvent associations
ImportEvent.belongsTo(User, { as: 'ImportedBy', foreignKey: 'importedBy' });
ImportEvent.belongsTo(User, { as: 'ModifiedBy', foreignKey: 'modifiedBy' });
ImportEvent.hasMany(Address, { foreignKey: 'importId' });
ImportEvent.hasMany(Client, { foreignKey: 'importId' });
ImportEvent.hasMany(DnoDetail, { foreignKey: 'importId' });
ImportEvent.hasMany(ElevationInstall, { foreignKey: 'importId' });
ImportEvent.hasMany(ElevationSpec, { foreignKey: 'importId' });
ImportEvent.hasMany(FormSubmission, { foreignKey: 'importId' });
ImportEvent.hasMany(Job, { foreignKey: 'importId' });
ImportEvent.hasMany(McsRefCounty, { foreignKey: 'importId' });
ImportEvent.hasMany(McsSubmission, { foreignKey: 'importId' });
ImportEvent.hasMany(Plot, { foreignKey: 'importId' });
ImportEvent.hasMany(PlotInstall, { foreignKey: 'importId' });
ImportEvent.hasMany(PlotSpec, { foreignKey: 'importId' });
ImportEvent.hasMany(Product, { foreignKey: 'importId' });
ImportEvent.hasMany(Project, { foreignKey: 'importId' });
ImportEvent.hasMany(ProjectProcess, { foreignKey: 'importId' });
ImportEvent.hasMany(Region, { foreignKey: 'importId' });
ImportEvent.hasMany(Site, { foreignKey: 'importId' });
ImportEvent.hasMany(Slot, { foreignKey: 'importId' });
ImportEvent.hasMany(Status, { foreignKey: 'importId' });
ImportEvent.hasMany(Team, { foreignKey: 'importId' });
ImportEvent.hasMany(User, { foreignKey: 'importId' });

// Job associations
Job.belongsTo(Plot, { foreignKey: 'plotId' });
Job.belongsTo(Project, { foreignKey: 'projectId' });
Job.belongsTo(Slot, { foreignKey: 'slotId' });
Job.belongsTo(Status, { foreignKey: 'jobStatus' });
Job.belongsTo(User, { as: 'DispatchedBy', foreignKey: 'dispatchedBy' });
Job.belongsTo(User, { as: 'ReturnedBy', foreignKey: 'returnedBy' });
Job.belongsTo(Team, { foreignKey: 'dispatchTeam' });

// McsSubmission associations
McsSubmission.belongsTo(Status, { foreignKey: 'mcsSubmitStatus' });
McsSubmission.belongsTo(User, { as: 'SubmissionCheckedBy', foreignKey: 'submissionCheckedBy' });
McsSubmission.belongsTo(User, { as: 'SubmittedBy', foreignKey: 'submittedBy' });

// Plot associations
Plot.belongsTo(Project, { foreignKey: 'projectId' });
Plot.belongsTo(Site, { foreignKey: 'site' });
Plot.belongsTo(Address, { foreignKey: 'plotAddressId' });
Plot.belongsTo(Status, { foreignKey: 'plotStatus' });
Plot.hasMany(FormSubmission, { foreignKey: 'plotId' });
Plot.hasOne(PlotInstall, { foreignKey: 'plotId' });
Plot.hasMany(PlotSpec, { foreignKey: 'plotId' });

// PlotInstall associations
PlotInstall.belongsTo(Plot, { foreignKey: 'plotId' });
PlotInstall.belongsTo(User, { as: 'InstallBy', foreignKey: 'installBy' });
PlotInstall.belongsTo(User, { as: 'CheckedBy', foreignKey: 'checkedBy' });
PlotInstall.belongsTo(Status, { foreignKey: 'plotInstallStatus' });
PlotInstall.hasMany(ElevationInstall, { foreignKey: 'plotInstallId' }); // we can have many elevations per install
PlotInstall.belongsTo(Product, { as: 'Meter', foreignKey: 'meter' });
PlotInstall.belongsTo(Product, { as: 'Battery', foreignKey: 'battery' });

// PlotSpec associations
PlotSpec.belongsTo(Plot, { foreignKey: 'plotId' });
PlotSpec.hasMany(ElevationSpec, { foreignKey: 'plotSpecId' }); // we can have many elecations per spec
PlotSpec.belongsTo(User, { as: 'SpecifiedBy', foreignKey: 'specifiedBy' });
PlotSpec.belongsTo(Status, { foreignKey: 'plotSpecStatus' });
PlotSpec.belongsTo(Product, { as: 'Meter', foreignKey: 'meter' });
PlotSpec.belongsTo(Product, { as: 'Battery', foreignKey: 'battery' });

// Product associations
Product.hasMany(PlotInstall, { as: 'Meters', foreignKey: 'meter' });
Product.hasMany(PlotInstall, { as: 'Batteries', foreignKey: 'battery' });
Product.hasMany(PlotSpec, { as: 'Meters', foreignKey: 'meter' });
Product.hasMany(PlotSpec, { as: 'Batteries', foreignKey: 'battery' });
Product.hasMany(ElevationInstall, { foreignKey: 'inverter' });
Product.hasMany(ElevationInstall, { foreignKey: 'panel' });
Product.hasMany(ElevationInstall, { foreignKey: 'roofKit' });
Product.hasMany(ElevationSpec, { foreignKey: 'inverter' });
Product.hasMany(ElevationSpec, { foreignKey: 'panel' });
Product.hasMany(ElevationSpec, { foreignKey: 'roofKit' });

// Project associations
Project.belongsTo(Client, { foreignKey: 'clientId' });
Project.belongsTo(DnoDetail, { foreignKey: 'dnoDetailsId' });
Project.belongsTo(Region, { foreignKey: 'regionId' });
Project.belongsTo(Site, { foreignKey: 'siteId' });
Project.belongsTo(ProjectProcess, { foreignKey: 'projectProcessId' });
Project.hasMany(Plot, { foreignKey: 'projectId' });
Project.hasMany(Job, { foreignKey: 'projectId' });

// ProjectProcess associations
ProjectProcess.belongsTo(Status, { as: 'ApprovalStatus', foreignKey: 'approvalStatus' });
ProjectProcess.belongsTo(Status, { as: 'DnoStatus', foreignKey: 'dnoStatus' });

// Region associations
Region.hasMany(Project, { foreignKey: 'regionId' });
Region.hasMany(Address, { foreignKey: 'addressRegionId' });

// Site associations
Site.belongsTo(Address, { foreignKey: 'siteAddressId' });
Site.belongsTo(DnoDetail, { foreignKey: 'dnoDetailsId' });
Site.belongsTo(User, { as: 'SiteManager', foreignKey: 'siteManagerId' });
Site.hasMany(Project, { foreignKey: 'siteId' });

// Slot associations
Slot.hasMany(Job, { foreignKey: 'slotId' });

// Status associations
Status.hasMany(Job, { foreignKey: 'jobStatus' });
Status.hasMany(Plot, { foreignKey: 'plotStatus' });
Status.hasMany(PlotInstall, { foreignKey: 'plotInstallStatus' });
Status.hasMany(ProjectProcess, { as: 'ApprovalStatus', foreignKey: 'approvalStatus' });
Status.hasMany(ProjectProcess, { as: 'DnoStatus', foreignKey: 'dnoStatus' });
Status.hasMany(McsSubmission, { foreignKey: 'mcsSubmitStatus' });
Status.hasMany(PlotSpec, { foreignKey: 'plotSpecStatus' });

// Team associations
Team.hasMany(User, { foreignKey: 'teamId' });

// User associations
User.belongsTo(Team, { foreignKey: 'teamId' });
User.hasOne(Address, { foreignKey: 'userAddressId' });
User.hasMany(Job, { as: 'DispatchedBy', foreignKey: 'dispatchedBy' });
User.hasMany(Job, { as: 'ReturnedBy', foreignKey: 'returnedBy' });
User.hasMany(PlotInstall, { as: 'InstallBy', foreignKey: 'installBy' });
User.hasMany(PlotInstall, { as: 'CheckedBy', foreignKey: 'checkedBy' });
User.hasMany(McsSubmission, { as: 'SubmissionCheckedBy', foreignKey: 'submissionCheckedBy' });
User.hasMany(McsSubmission, { as: 'SubmittedBy', foreignKey: 'submittedBy' });
User.hasMany(ImportEvent, { as: 'ImportedBy', foreignKey: 'importedBy' });
User.hasMany(ImportEvent, { as: 'ModifiedBy', foreignKey: 'modifiedBy' });
User.hasMany(Site, { as: 'SiteManager', foreignKey: 'siteManagerId' });
User.hasMany(PlotSpec, { as: 'SpecifiedBy', foreignKey: 'specifiedBy' });

module.exports = {
  sequelize,
  Sequelize,
  Address,
  Client,
  DnoDetail,
  ElevationInstall,
  ElevationSpec,
  FormSubmission,
  ImportEvent,
  Job,
  McsRefCounty,
  McsSubmission,
  Plot,
  PlotInstall,
  PlotSpec,
  Product,
  Project,
  ProjectProcess,
  Region,
  Site,
  Slot,
  Status,
  Team,
  User
};
