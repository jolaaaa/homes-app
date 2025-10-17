import { Injectable } from '@nestjs/common';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

export interface Location {
    id: number;
    name: string;
    city: string;
    state: string;
    availableUnits: number;
    wifi: boolean;
    laundry: boolean;
    photo: string;
}

@Injectable()
export class LocationsService {
    private locations: Location[] = [];
    private dataPath: string;

    constructor() {
        // path assoluto corretto al file JSON nella cartella src
        this.dataPath = join(__dirname, 'data', 'locations.json');
        try {
            this.locations = JSON.parse(readFileSync(this.dataPath, 'utf8'));
        } catch (err) {
            console.error('Errore caricando locations.json:', err);
            this.locations = [];
        }
    }

    getAll(): Location[] {
        return this.locations;
    }

    getById(id: number): Location | null {
        return this.locations.find(loc => loc.id === id) || null;
    }

    addLocation(newLocation: Location): Location {
        newLocation.id = this.locations.length
            ? Math.max(...this.locations.map(loc => loc.id)) + 1
            : 1;

        this.locations.push(newLocation);

        // scrive sul file JSON con path assoluto coerente
        try {
            writeFileSync(this.dataPath, JSON.stringify(this.locations, null, 2));
        } catch (err) {
            console.error('Errore scrivendo locations.json:', err);
        }

        return newLocation;
    }
}
