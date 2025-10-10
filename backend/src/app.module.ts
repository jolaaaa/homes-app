import {Module, UnprocessableEntityException} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {LocationsModule} from "./locations/locations.module";
import {AuthModule} from "./auth/auth.module";
import {AuthController} from "./auth/auth.controller";
import {ApplicationsModule} from "./apply/applications.module";
import {TypeOrmModule} from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Module({
    imports: [LocationsModule, AuthModule, ApplicationsModule, ConfigModule.forRoot({isGlobal:true}),
    TypeOrmModule.forRoot({
        type: 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT ?? '5434', 10),
        username: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'password',
        database: process.env.DB_NAME || 'mydb',
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true, // solo per sviluppo!
    })
    ],
    controllers: [AppController, AuthController],
    providers: [AppService],
})

export class AppModule {
}
