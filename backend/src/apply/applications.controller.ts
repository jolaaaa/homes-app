import {Controller, Post, Body} from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import {InjectRepository} from "@nestjs/typeorm";
import { Repository } from 'typeorm';
import {Application} from "./applications.entity";

/*interface Application {
    firstName: string;
    lastName: string;
    email: string;
}*/

@Controller('applications')
export class ApplicationsController {
    constructor(
        @InjectRepository(Application)
        private readonly repo: Repository<Application>,
    ) {}

    @Post()
    async submitApplication(@Body() body: Partial<Application>) {
        // Crea una nuova entity dal body
        const application = this.repo.create(body);
        // Salva nel database
        await this.repo.save(application);

        return { message: 'Application saved successfully' };
    }
}
