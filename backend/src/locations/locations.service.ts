import {Injectable} from '@nestjs/common';
import {LocationsInterface} from "./locations.interface";
import {join} from 'path';
import {readFileSync} from 'fs';

@Injectable()
export class LocationsService {
    private locations: LocationsInterface[] = [];

    constructor() {
        const filePath = join(process.cwd(), 'src', 'locations', 'data', 'locations.json');
        const fileData = readFileSync(filePath, 'utf8');
        this.locations = JSON.parse(fileData);
    }

    findAll(): LocationsInterface[] {
        return this.locations;
    }

    findOne(id: number): LocationsInterface | undefined {
        return this.locations.find((loc) => loc.id === id);
    }
}


