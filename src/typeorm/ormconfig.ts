import 'dotenv/config';
import { DataSource } from 'typeorm';

const { DB_USERNAME, DB_PASSWORD, DB_NAME, DB_HOST, DB_HOST_LOCAL, DB_PORT, NODE_ENV } = process.env;

const dataSource = new DataSource({
    type: 'postgres',
    username: DB_USERNAME,
    password: DB_PASSWORD,
    port: +DB_PORT,
    host: DB_HOST_LOCAL,
    database: DB_NAME,
    logging: NODE_ENV === 'development',
    migrationsTableName: "migrations",
    migrations: ['src/typeorm/migrations/*{.ts,.js}'],
    migrationsRun: false,
    synchronize: false,
});

export default dataSource;