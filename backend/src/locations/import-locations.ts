import { AppDataSource } from "../data-source";
import { Location } from "./locations.entity";
import * as fs from "fs";
import * as path from "node:path";

async function importLocations() {
    await AppDataSource.initialize();

    const filePath = path.join(__dirname, "data", "locations.json");
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    const repo = AppDataSource.getRepository(Location);

    for (const loc of data) {
        const location = repo.create({
            name: loc.name,
            city: loc.city,
            state: loc.state,
            photo: loc.photo,
            availableUnits: loc.availableUnits,
            wifi: loc.wifi,
            laundry: loc.laundry,
        });
        await repo.save(location);
    }

    await AppDataSource.destroy();
}

importLocations().catch(console.error);
