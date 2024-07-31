interface DatabaseConfig {
    username: string;
    password: string;
    database: string;
    host: string;
    dialect: 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql';
    use_env_variable?: string;
}

interface Config {
    development: DatabaseConfig;
    test: DatabaseConfig;
    production: DatabaseConfig;
}

declare const config: Config;

export default config;
