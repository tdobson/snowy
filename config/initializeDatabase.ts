import { Sequelize } from 'sequelize';
import fs from 'fs';
import path from 'path';
import config from './config.json';

const env = process.env.NODE_ENV || 'development';
const dbConfig = (config as any)[env];

export async function initializeDatabase() {
  const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, dbConfig);

  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    // Read and execute SQL files
    const sqlFiles = [
      'install_database.sql',
      'install_indexes.sql',
      'install_views.sql',
      'install_users.sql',
      'install_data.sql'
    ];

    for (const file of sqlFiles) {
      const sql = fs.readFileSync(path.join(__dirname, file), 'utf8');
      await sequelize.query(sql);
      console.log(`Executed ${file} successfully.`);
    }

    console.log('Database initialization completed successfully.');
  } catch (error) {
    console.error('Unable to initialize database:', error);
  } finally {
    await sequelize.close();
  }
}
