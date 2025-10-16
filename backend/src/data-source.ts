import 'reflect-metadata';
import {DataSource} from 'typeorm';
import * as dotenv from 'dotenv';
import {User} from "./auth/user.entity";
import { Location } from "./locations/locations.entity";
import {Application} from "./apply/applications.entity";


dotenv.config();

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT ?? '5434', 10),
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'mydb',
    synchronize: false,
    logging: true,
    entities: [User, Location, Application],
    migrations: ['src/migrations/*.ts'],
});
