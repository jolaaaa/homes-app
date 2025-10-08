import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {LocationsModule} from "./locations/locations.module";
import {LocationsController} from "./locations/locations.controller";
import {LocationsService} from "./locations/locations.service";
import {AuthModule} from "./auth/auth.module";
import {AuthController} from "./auth/auth.controller";

@Module({
    imports: [LocationsModule, AuthModule],
    controllers: [AppController, AuthController],
    providers: [AppService],
})
export class AppModule {
}
