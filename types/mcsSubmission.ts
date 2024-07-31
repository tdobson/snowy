import { Model, Optional } from 'sequelize';

export interface McsSubmissionAttributes {
    mcsSubmissionId: string;
    mcsSubmitStatus: string;
    mcsCertificateNumber?: string;
    mcsCertificateId?: string;
    mcsCertificateDate?: Date;
    mcsLoadedDate?: Date;
    mcsSubmittedDate?: Date;
    mcsCheckedDate?: Date;
    mcsApiReturnMessage?: string;
    submissionCheckedBy?: string;
    submittedBy?: string;
    importId?: string;
}

export interface McsSubmissionCreationAttributes extends Optional<McsSubmissionAttributes, 'mcsSubmissionId'> {}

export interface McsSubmissionInstance extends Model<McsSubmissionAttributes, McsSubmissionCreationAttributes>, McsSubmissionAttributes {}
