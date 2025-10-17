import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HousingLocation } from './housing-location';
import {FormControl, ɵValue} from "@angular/forms";

@Injectable({
    providedIn: 'root'
})
export class HousingService {
    private baseUrl = 'http://localhost:3000/locations';
    private applicationsUrl = 'http://localhost:3000/applications';

    constructor(private http: HttpClient) {}


    getAllHousingLocations(): Observable<HousingLocation[]> {
        return this.http.get<HousingLocation[]>(this.baseUrl);
    }

    getHousingLocationById(id: number): Observable<HousingLocation> {
        return this.http.get<HousingLocation>(`${this.baseUrl}/${id}`);
    }


    addNewHouse(locationData: {
        name?: ɵValue<FormControl<string | null>>;
        city?: ɵValue<FormControl<string | null>>;
        state?: ɵValue<FormControl<string | null>>;
        availableUnits?: ɵValue<FormControl<number | null>>;
        wifi: boolean;
        laundry: boolean;
        photo: string
    }): Observable<HousingLocation> {
        return this.http.post<HousingLocation>(this.baseUrl, locationData);
    }

    submitApplication(firstName: string, lastName: string, email: string, houseName: string) {
        const body = { firstName, lastName, email, houseName };
        return this.http.post(this.applicationsUrl, body);
    }
}
