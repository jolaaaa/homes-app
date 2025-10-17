import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Location} from './locations.entity';

@Injectable()
export class LocationsService {
    constructor(
        @InjectRepository(Location)
        private readonly locationRepository: Repository<Location>,
    ) {
    }

    // ottieni tutte le location
    async getAll(): Promise<Location[]> {
        return await this.locationRepository.find();
    }

    // ottieni location dall'id
    async getById(id: number): Promise<Location> {
        const location = await this.locationRepository.findOne({where: {id}});
        if (!location) throw new NotFoundException(`Location ${id} not found`);
        return location;
    }

    // aggiugni nuova location
    async addLocation(data: Omit<Location, 'id'>): Promise<Location> {
        const newLocation = this.locationRepository.create(data);
        return await this.locationRepository.save(newLocation);
    }
}
