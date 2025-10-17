import { Controller, Get, Post, Body, Param, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import type { Location } from './locations.service';

@Controller('locations')
export class LocationsController {
    // percorso corretto al file JSON
    private readonly filePath = path.join(__dirname, 'data', 'locations.json');
    private locations: Location[] = [];

    constructor() {
        this.loadLocations();
    }

    private loadLocations() {
        try {
            if (fs.existsSync(this.filePath)) {
                const data = fs.readFileSync(this.filePath, 'utf-8');
                this.locations = JSON.parse(data) as Location[];
            } else {
                this.locations = [];
                this.saveLocations(); // crea il file se non esiste
            }
        } catch (err) {
            console.error('Errore caricando locations.json:', err);
            this.locations = [];
        }
    }

    private saveLocations() {
        try {
            fs.writeFileSync(this.filePath, JSON.stringify(this.locations, null, 2), 'utf-8');
        } catch (err) {
            console.error('Errore salvando locations.json:', err);
        }
    }

    @Get()
    getAll(): Location[] {
        return this.locations;
    }

    @Get(':id')
    getById(@Param('id') id: string): Location {
        const location = this.locations.find(loc => loc.id === parseInt(id, 10));
        if (!location) throw new NotFoundException(`Location ${id} not found`);
        return location;
    }

    @Post()
    addLocation(@Body() newLocation: Omit<Location, 'id'>): Location {
        const nextId = this.locations.length > 0 ? Math.max(...this.locations.map(l => l.id)) + 1 : 1;
        const locationToAdd: Location = { id: nextId, ...newLocation };

        this.locations.push(locationToAdd);
        this.saveLocations();
        return locationToAdd;
    }
}
