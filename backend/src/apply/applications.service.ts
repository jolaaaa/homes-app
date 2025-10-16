import {Injectable} from "@nestjs/common";
import {Repository} from "typeorm";
import {Application} from "./applications.entity";
import {InjectRepository} from "@nestjs/typeorm";

@Injectable()
export class ApplicationsService {
    private readonly applicationsService = ApplicationsService;
    constructor(
        @InjectRepository(Application)
        private repo: Repository<Application>,
    ) {}

    createApplication(data: Partial<Application>) {
        const app = this.repo.create(data);
        return this.repo.save(app);
    }

    findAll() {
        return this.repo.find();
    }

}
