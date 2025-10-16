import {Module} from '@nestjs/common';
import {Application} from "./applications.entity";
import {TypeOrmModule} from "@nestjs/typeorm";
import { ApplicationsService } from './applications.service';
import { ApplicationsController } from './applications.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Application])],
    providers: [ApplicationsService],
    controllers: [ApplicationsController],
})
export class ApplicationsModule {
}
