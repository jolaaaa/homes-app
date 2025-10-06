import {Injectable} from '@angular/core';
import {HousingLocation} from "./housing-location";

@Injectable({
    providedIn: 'root'
    // servizio disponibile in tutta l'applicazione
})
export class HousingService {
    //URL del backend: un JSON locale
    url = "http://localhost:3000/locations";

    constructor() {
    }

    // recupera tutte le abitazioni disponibili
    async getAllHousingLocations(): Promise<HousingLocation[]> {
        const data = await fetch(this.url); // HTTP Request
        return await data.json() ?? []; // return dei dati come array o null
    }

    // recupera le abitazioni specifiche in base all'id
    async getHousingLocationById(id: Number): Promise<HousingLocation | undefined> {
        const data = await fetch(`${this.url}/${id}`); // prende l'id delle location
        return await data.json() ?? {}; // return l'oggetto corrispondente
    }

// segna i dati in console del browser
    submitApplication(firstName: string, lastName: string, email: string) {
        console.log(firstName, lastName, email);
    }
}

