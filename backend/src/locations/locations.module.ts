import {Module} from '@nestjs/common';
import {LocationsController} from './locations.controller';
import {LocationsService} from './locations.service';
import { Location } from './locations.entity';
import {TypeOrmModule} from "@nestjs/typeorm";


@Module({
    imports: [TypeOrmModule.forFeature([Location])],
    controllers: [LocationsController],
    providers: [LocationsService],
    exports: [TypeOrmModule, LocationsService],
})
export class LocationsModule {
}
