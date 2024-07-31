import { Model, Optional } from 'sequelize';

export interface ProjectProcessAttributes {
    projectProcessId: string;
    instanceId: string;
    approvalStatus?: string;
    deadlineToConnect?: Date;
    authLetterSent?: boolean;
    mpanRequestSent?: boolean;
    schematicCreated?: boolean;
    applicationType?: string;
    formalDnoSubmitted?: boolean;
    submissionDate?: Date;
    dnoDueDate?: Date;
    dnoStatus?: string;
    approvedKwp?: number;
    quoteReceived?: boolean;
    customerInvoicedDate?: Date;
    dnoPaymentMade?: Date;
    acceptanceFormReturned?: boolean;
    dateApproved?: Date;
    importId?: string;
}

export interface ProjectProcessCreationAttributes extends Optional<ProjectProcessAttributes, 'projectProcessId'> {}

export interface ProjectProcessInstance extends Model<ProjectProcessAttributes, ProjectProcessCreationAttributes>, ProjectProcessAttributes {}
