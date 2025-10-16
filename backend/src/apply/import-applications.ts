import { AppDataSource } from '../data-source';
import { Application } from './applications.entity';
import * as fs from 'fs';
import * as path from 'path';

async function importApplications() {
    await AppDataSource.initialize();

    const filePath = path.join(__dirname, 'applications.json');
    if (!fs.existsSync(filePath)) {
        console.error('File applications.json non trovato!');
        process.exit(1);
    }

    const applicationsData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const repo = AppDataSource.getRepository(Application);

    await repo.insert(applicationsData);

    await AppDataSource.destroy();
}

importApplications().catch(console.error);
