import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { Application } from "./applications.entity";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class ApplicationsService {

    constructor(
        @InjectRepository(Application)
        private repo: Repository<Application>,
    ) {}

    createApplication(data: Partial<Application>) {
        const app = this.repo.create(data);
        return this.repo.save(app);
    }

    async findAll(): Promise<Application[]> {
        return this.repo.find({ order: { createdAt: 'DESC' } });
    }



    async findByHouseName(houseName: string): Promise<Application[]> {
        return this.repo.createQueryBuilder('a')
            .where('LOWER(a.houseName) = LOWER(:houseName)', { houseName })
            .orderBy('a.createdAt', 'DESC')
            .getMany();
    }
}
