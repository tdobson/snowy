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
const Instance = require('./instance');

// Address associations
Address.hasMany(Site, { foreignKey: 'site_address_id' });
Address.hasMany(Client, { foreignKey: 'client_address_id' });
Address.hasMany(Plot, { foreignKey: 'plot_address_id' });
Address.belongsTo(Region, { foreignKey: 'address_region_id' });

// Client associations
Client.hasMany(Project, { foreignKey: 'client_id' });
Client.belongsTo(Address, { foreignKey: 'client_address_id' });
Client.belongsTo(User, { as: 'ContactPerson', foreignKey: 'contact_id' });

// DnoDetail associations
DnoDetail.hasMany(Project, { foreignKey: 'dno_details_id' });
DnoDetail.hasMany(Site, { foreignKey: 'dno_details_id' });

// ElevationInstall associations
ElevationInstall.belongsTo(PlotInstall, { foreignKey: 'plot_install_id' });
ElevationInstall.belongsTo(Product, { as: 'Inverter', foreignKey: 'inverter' });
ElevationInstall.belongsTo(Product, { as: 'Panel', foreignKey: 'panel' });
ElevationInstall.belongsTo(Product, { as: 'RoofKit', foreignKey: 'roof_kit' });

// ElevationSpec associations
ElevationSpec.belongsTo(PlotSpec, { foreignKey: 'plot_spec_id' });
ElevationSpec.belongsTo(Product, { as: 'Inverter', foreignKey: 'inverter' });
ElevationSpec.belongsTo(Product, { as: 'Panel', foreignKey: 'panel' });
ElevationSpec.belongsTo(Product, { as: 'RoofKit', foreignKey: 'roof_kit' });

// FormSubmission associations
FormSubmission.belongsTo(Plot, { foreignKey: 'plot_id' });
FormSubmission.belongsTo(Job, { foreignKey: 'job_id' });

// ImportEvent associations
ImportEvent.belongsTo(User, { as: 'ImportedBy', foreignKey: 'imported_by' });
ImportEvent.belongsTo(User, { as: 'ModifiedBy', foreignKey: 'modified_by' });

// Job associations
Job.belongsTo(Plot, { foreignKey: 'plot_id' });
Job.belongsTo(Project, { foreignKey: 'project_id' });
Job.belongsTo(User, { foreignKey: 'user_id' });
Job.belongsTo(Slot, { foreignKey: 'slot_id' });
Job.belongsTo(Status, { foreignKey: 'job_status' });
Job.belongsTo(FormSubmission, { foreignKey: 'submission_id' });
Job.belongsTo(User, { as: 'DispatchedBy', foreignKey: 'dispatched_by' });
Job.belongsTo(User, { as: 'ReturnedBy', foreignKey: 'returned_by' });
Job.belongsTo(Team, { foreignKey: 'dispatch_team' });

// McsSubmission associations
McsSubmission.belongsTo(Status, { foreignKey: 'mcs_submit_status' });
McsSubmission.belongsTo(User, { as: 'SubmissionCheckedBy', foreignKey: 'submission_checked_by' });
McsSubmission.belongsTo(User, { as: 'SubmittedBy', foreignKey: 'submitted_by' });

// Plot associations
Plot.belongsTo(Project, { foreignKey: 'project_id' });
Plot.belongsTo(PlotInstall, { foreignKey: 'plot_install_id' });
Plot.belongsTo(Status, { foreignKey: 'plot_status' });
Plot.belongsTo(Site, { foreignKey: 'site_id' });
Plot.belongsTo(Address, { foreignKey: 'plot_address_id' });
Plot.hasMany(FormSubmission, { foreignKey: 'plot_id' });
Plot.hasMany(PlotSpec, { foreignKey: 'plot_id' });

// PlotInstall associations
PlotInstall.belongsTo(Plot, { foreignKey: 'plot_id' });
PlotInstall.belongsTo(User, { as: 'InstallBy', foreignKey: 'install_by' });
PlotInstall.belongsTo(User, { as: 'CheckedBy', foreignKey: 'checked_by' });
PlotInstall.belongsTo(Status, { foreignKey: 'plot_install_status' });
PlotInstall.hasMany(ElevationInstall, { foreignKey: 'plot_install_id' });
PlotInstall.belongsTo(Product, { as: 'Meter', foreignKey: 'meter' });
PlotInstall.belongsTo(Product, { as: 'Battery', foreignKey: 'battery' });
PlotInstall.belongsTo(McsSubmission, { foreignKey: 'mcs_submission_id' });

// PlotSpec associations
PlotSpec.belongsTo(Plot, { foreignKey: 'plot_id' });
PlotSpec.belongsTo(User, { as: 'SpecifiedBy', foreignKey: 'specified_by' });
PlotSpec.belongsTo(Status, { foreignKey: 'plot_spec_status' });
PlotSpec.belongsTo(Product, { as: 'Meter', foreignKey: 'meter' });
PlotSpec.belongsTo(Product, { as: 'Battery', foreignKey: 'battery' });
PlotSpec.hasMany(ElevationSpec, { foreignKey: 'plot_spec_id' });

// Project associations
Project.belongsTo(Client, { foreignKey: 'client_id' });
Project.belongsTo(DnoDetail, { foreignKey: 'dno_details_id' });
Project.belongsTo(Region, { foreignKey: 'region_id' });
Project.belongsTo(Site, { foreignKey: 'site_id' });
Project.belongsTo(ProjectProcess, { foreignKey: 'project_process_id' });
Project.hasMany(Plot, { foreignKey: 'project_id' });
Project.hasMany(Job, { foreignKey: 'project_id' });

// ProjectProcess associations
ProjectProcess.belongsTo(Status, { as: 'ApprovalStatus', foreignKey: 'approval_status' });
ProjectProcess.belongsTo(Status, { as: 'DnoStatus', foreignKey: 'dno_status' });

// Region associations
Region.hasMany(Project, { foreignKey: 'region_id' });
Region.hasMany(Address, { foreignKey: 'address_region_id' });

// Site associations
Site.belongsTo(DnoDetail, { foreignKey: 'dno_details_id' });
Site.belongsTo(Address, { foreignKey: 'site_address_id' });
Site.belongsTo(User, { as: 'SiteManager', foreignKey: 'site_manager_id' });
Site.belongsTo(User, { as: 'SiteSurveyor', foreignKey: 'site_surveyor_id' });
Site.belongsTo(User, { as: 'SiteAgent', foreignKey: 'site_agent_id' });
Site.hasMany(Project, { foreignKey: 'site_id' });

// Slot associations
Slot.hasMany(Job, { foreignKey: 'slot_id' });

// Status associations
Status.hasMany(Job, { foreignKey: 'job_status' });
Status.hasMany(Plot, { foreignKey: 'plot_status' });
Status.hasMany(PlotInstall, { foreignKey: 'plot_install_status' });
Status.hasMany(ProjectProcess, { as: 'ApprovalStatus', foreignKey: 'approval_status' });
Status.hasMany(ProjectProcess, { as: 'DnoStatus', foreignKey: 'dno_status' });
Status.hasMany(McsSubmission, { foreignKey: 'mcs_submit_status' });
Status.hasMany(PlotSpec, { foreignKey: 'plot_spec_status' });

// Team associations
Team.hasMany(User, { foreignKey: 'team' });

// User associations
User.belongsTo(Team, { foreignKey: 'team' });
User.hasMany(Job, { foreignKey: 'user_id' });
User.hasMany(Job, { as: 'DispatchedBy', foreignKey: 'dispatched_by' });
User.hasMany(Job, { as: 'ReturnedBy', foreignKey: 'returned_by' });
User.hasMany(PlotInstall, { as: 'InstallBy', foreignKey: 'install_by' });
User.hasMany(PlotInstall, { as: 'CheckedBy', foreignKey: 'checked_by' });
User.hasMany(McsSubmission, { as: 'SubmissionCheckedBy', foreignKey: 'submission_checked_by' });
User.hasMany(McsSubmission, { as: 'SubmittedBy', foreignKey: 'submitted_by' });
User.hasMany(ImportEvent, { as: 'ImportedBy', foreignKey: 'imported_by' });
User.hasMany(ImportEvent, { as: 'ModifiedBy', foreignKey: 'modified_by' });
User.hasMany(Site, { as: 'SiteManager', foreignKey: 'site_manager_id' });
User.hasMany(Site, { as: 'SiteSurveyor', foreignKey: 'site_surveyor_id' });
User.hasMany(Site, { as: 'SiteAgent', foreignKey: 'site_agent_id' });
User.hasMany(PlotSpec, { as: 'SpecifiedBy', foreignKey: 'specified_by' });
User.hasMany(Client, { as: 'ContactPerson', foreignKey: 'contact_id' });

// Instance associations
Instance.hasMany(Address, { foreignKey: 'instance_id' });
Instance.hasMany(Client, { foreignKey: 'instance_id' });
Instance.hasMany(DnoDetail, { foreignKey: 'instance_id' });
Instance.hasMany(ElevationInstall, { foreignKey: 'instance_id' });
Instance.hasMany(ElevationSpec, { foreignKey: 'instance_id' });
Instance.hasMany(FormSubmission, { foreignKey: 'instance_id' });
Instance.hasMany(ImportEvent, { foreignKey: 'instance_id' });
Instance.hasMany(Job, { foreignKey: 'instance_id' });
//Instance.hasMany(McsRefCounty, { foreignKey: 'instance_id' });
//Instance.hasMany(McsSubmission, { foreignKey: 'instance_id' });
Instance.hasMany(Plot, { foreignKey: 'instance_id' });
Instance.hasMany(PlotInstall, { foreignKey: 'instance_id' });
Instance.hasMany(PlotSpec, { foreignKey: 'instance_id' });
Instance.hasMany(Product, { foreignKey: 'instance_id' });
Instance.hasMany(Project, { foreignKey: 'instance_id' });
Instance.hasMany(ProjectProcess, { foreignKey: 'instance_id' });
Instance.hasMany(Region, { foreignKey: 'instance_id' });
Instance.hasMany(Site, { foreignKey: 'instance_id' });
Instance.hasMany(Slot, { foreignKey: 'instance_id' });
Instance.hasMany(Status, { foreignKey: 'instance_id' });
Instance.hasMany(Team, { foreignKey: 'instance_id' });
Instance.hasMany(User, { foreignKey: 'instance_id' });

Address.belongsTo(Instance, { foreignKey: 'instance_id' });
Client.belongsTo(Instance, { foreignKey: 'instance_id' });
DnoDetail.belongsTo(Instance, { foreignKey: 'instance_id' });
ElevationInstall.belongsTo(Instance, { foreignKey: 'instance_id' });
ElevationSpec.belongsTo(Instance, { foreignKey: 'instance_id' });
FormSubmission.belongsTo(Instance, { foreignKey: 'instance_id' });
ImportEvent.belongsTo(Instance, { foreignKey: 'instance_id' });
Job.belongsTo(Instance, { foreignKey: 'instance_id' });
//McsRefCounty.belongsTo(Instance, { foreignKey: 'instance_id' });
//McsSubmission.belongsTo(Instance, { foreignKey: 'instance_id' });
Plot.belongsTo(Instance, { foreignKey: 'instance_id' });
PlotInstall.belongsTo(Instance, { foreignKey: 'instance_id' });
PlotSpec.belongsTo(Instance, { foreignKey: 'instance_id' });
Product.belongsTo(Instance, { foreignKey: 'instance_id' });
Project.belongsTo(Instance, { foreignKey: 'instance_id' });
ProjectProcess.belongsTo(Instance, { foreignKey: 'instance_id' });
Region.belongsTo(Instance, { foreignKey: 'instance_id' });
Site.belongsTo(Instance, { foreignKey: 'instance_id' });
Slot.belongsTo(Instance, { foreignKey: 'instance_id' });
Status.belongsTo(Instance, { foreignKey: 'instance_id' });
Team.belongsTo(Instance, { foreignKey: 'instance_id' });
User.belongsTo(Instance, { foreignKey: 'instance_id' });

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
