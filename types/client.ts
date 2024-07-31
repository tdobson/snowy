import { Model, Optional } from 'sequelize';

interface ClientAttributes {
  clientId: string;
  instanceId: string;
  clientLegacyNumber?: string;
  clientName: string;
  clientAddressId?: string;
  clientPlotCardRequired?: string;
  contactId?: string;
  importId?: string;
}

interface ClientCreationAttributes extends Optional<ClientAttributes, 'clientId'> {}

export interface ClientInstance extends Model<ClientAttributes, ClientCreationAttributes>, ClientAttributes {}
import { Model } from 'sequelize';

export interface ClientAttributes {
  clientId: string;
  instanceId: string;
  clientLegacyNumber?: string;
  clientName: string;
  clientAddressId?: string;
  clientPlotCardRequired?: string;
  contactId?: string;
  importId?: string;
}

export interface ClientCreationAttributes extends Omit<ClientAttributes, 'clientId'> {}

export interface ClientInstance
  extends Model<ClientAttributes, ClientCreationAttributes>,
    ClientAttributes {}
