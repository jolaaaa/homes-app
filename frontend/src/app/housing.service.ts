import {Injectable} from '@angular/core';
import {HousingLocation} from "./housing-location";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
    providedIn: 'root'
    // servizio disponibile in tutta l'applicazione
})
export class HousingService {
    //URL del backend: un JSON locale
    private url = 'http://localhost:3000/locations'; // spostare al backend nestjs

    constructor(private http: HttpClient) {}

    getAllHousingLocations(): Observable<HousingLocation[]> {
        return this.http.get<HousingLocation[]>(this.url);
    }

    getHousingLocationById(id: number): Observable<HousingLocation> {
        return this.http.get<HousingLocation>(`${this.url}/${id}`);
    }

// segna i dati in console del browser
    submitApplication(firstName: string, lastName: string, email: string) {
        console.log(firstName, lastName, email);
    }
}


