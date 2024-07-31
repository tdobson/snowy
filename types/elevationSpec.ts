import { Model, Optional } from 'sequelize';

export interface ElevationSpecAttributes {
    elevationSpecId: string;
    plotSpecId: string;
    plotId: string;
    instanceId: string;
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

export interface ElevationSpecCreationAttributes extends Optional<ElevationSpecAttributes, 'elevationSpecId'> {}

export interface ElevationSpecInstance extends Model<ElevationSpecAttributes, ElevationSpecCreationAttributes>, ElevationSpecAttributes {}
