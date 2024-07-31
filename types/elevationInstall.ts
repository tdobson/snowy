import { Model, Optional } from 'sequelize';

export interface ElevationInstallAttributes {
    elevationInstallId: string;
    plotInstallId: string;
    instanceId: string;
    plotId: string;
    typeTestRef?: string;
    pitch?: number;
    orientation?: string;
    kkFigure?: number;
    kwp?: number;
    strings?: number;
    moduleQty?: number;
    inverter?: string;
    inverterCost?: number;
    panel?: string;
    panelCost?: number;
    panelsTotalCost?: number;
    roofKit?: string;
    roofKitCost?: number;
    annualYield?: number;
    importId?: string;
}

export interface ElevationInstallCreationAttributes extends Optional<ElevationInstallAttributes, 'elevationInstallId'> {}

export interface ElevationInstallInstance extends Model<ElevationInstallAttributes, ElevationInstallCreationAttributes>, ElevationInstallAttributes {}
