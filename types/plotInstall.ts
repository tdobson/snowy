import { Model, Optional } from 'sequelize';

export interface PlotInstallAttributes {
    plotInstallId: string;
    plotId: string;
    instanceId: string;
    dateInstall?: Date;
    dateChecked?: Date;
    installBy?: string;
    checkedBy?: string;
    plotInstallStatus: string;
    phase?: number;
    p1?: number;
    p2?: number;
    p3?: number;
    annualYield?: number;
    kwp?: number;
    kwpWithLimitation?: number;
    limiterRequired?: boolean;
    limiterValueIfNotZero?: number;
    labourCost?: number;
    meter?: string;
    meterCost?: number;
    battery?: string;
    batteryCost?: number;
    overallCost?: number;
    mcsSubmissionId?: string;
    importId?: string;
}

export interface PlotInstallCreationAttributes extends Optional<PlotInstallAttributes, 'plotInstallId'> {}

export interface PlotInstallInstance extends Model<PlotInstallAttributes, PlotInstallCreationAttributes>, PlotInstallAttributes {}
