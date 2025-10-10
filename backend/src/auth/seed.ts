import {NestFactory} from '@nestjs/core';
import {AppModule} from '../app.module';
import {UserSeederService} from './user-seeder.service';

async function bootstrap() {
    const appContext = await NestFactory.createApplicationContext(AppModule);
    const seeder = appContext.get(UserSeederService);
    await seeder.seed();
    await appContext.close();
    process.exit(0);
}

bootstrap();
