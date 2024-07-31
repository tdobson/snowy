import { Model, Optional } from 'sequelize';

export interface PlotSpecAttributes {
    plotSpecId: string;
    plotId: string;
    instanceId: string;
    dateSpecified?: Date;
    specifiedBy?: string;
    plotSpecStatus: string;
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
    landlordSupply?: boolean;
    importId?: string;
}

export interface PlotSpecCreationAttributes extends Optional<PlotSpecAttributes, 'plotSpecId'> {}

export interface PlotSpecInstance extends Model<PlotSpecAttributes, PlotSpecCreationAttributes>, PlotSpecAttributes {}
