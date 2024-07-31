import { Model, Optional } from 'sequelize';

export interface PlotAttributes {
    plotId: string;
    projectId: string;
    instanceId: string;
    plotInstallId?: string;
    plotNumber: string;
    plotStatus: string;
    site?: string;
    housetype?: string;
    g99?: boolean;
    mpan?: string;
    plotAddressId?: string;
    plotApproved?: boolean;
    commissioningFormSubmitted?: boolean;
    importId?: string;
    trackerRef?: string;
}

export interface PlotCreationAttributes extends Optional<PlotAttributes, 'plotId'> {}

export interface PlotInstance extends Model<PlotAttributes, PlotCreationAttributes>, PlotAttributes {}
