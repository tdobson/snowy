import { Sequelize, Options } from 'sequelize';
import config from './config.json';

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env as keyof typeof config] as Options;

const sequelize = new Sequelize(dbConfig);

export default sequelize;
