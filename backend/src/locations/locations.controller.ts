import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { Location } from './locations.entity';

@Controller('locations')
export class LocationsController {
    constructor(private readonly locationsService: LocationsService) {}

    @Get()
    async getAll(): Promise<Location[]> {
        return this.locationsService.getAll();
    }

    @Get(':id')
    async getById(@Param('id') id: number): Promise<Location> {
        return this.locationsService.getById(id);
    }

    @Post()
    async addLocation(@Body() newLocation: Omit<Location, 'id'>): Promise<Location> {
        return this.locationsService.addLocation(newLocation);
    }
}
