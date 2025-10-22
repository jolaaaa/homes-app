import {Controller, Post, Body, Get, Param} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from 'typeorm';
import {Application} from "./applications.entity";

@Controller('applications')
export class ApplicationsController {
    constructor(
        @InjectRepository(Application)
        private readonly repo: Repository<Application>,
    ) {
    }

    @Post()
    async submitApplication(@Body() body: Partial<Application>) {
        const application = this.repo.create(body);
        await this.repo.save(application);
        return {message: 'Application saved successfully'};
    }

    @Get()
    async getAllApplications() {
        return this.repo.find({order: {createdAt: 'DESC'}});
    }

    @Get('house/:houseName')
    async getByHouse(@Param('houseName') houseName: string) {
        const decoded = decodeURIComponent(houseName);
        return this.repo.createQueryBuilder('a')
            .where('LOWER(a.houseName) = LOWER(:houseName)', {houseName: decoded})
            .orderBy('a.createdAt', 'DESC')
            .getMany();
    }
}
