import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HousingLocationComponent} from "../housing-location/housing-location.component";
import {HousingLocation} from "../housing-location";
import {HousingService} from "../housing.service";
import {HttpClientModule} from "@angular/common/http";
import {Router} from "@angular/router";

@Component({
    selector: 'app-home', // nome tag HTML per questo componente
    standalone: true,
    imports: [CommonModule, HousingLocationComponent, HttpClientModule],
    providers: [HousingService],
    template: `
        <header class="header">
            <form class="search-form">
                <input type="text" placeholder="Filter by city" #filter>
                <button class="primary" type="button" (click)="filterResults(filter.value)">Search</button>
            </form>

            <div class="user-menu" (click)="toggleMenu()">
                <span class="user-icon">👤</span>
                <div *ngIf="menuOpen" class="menu-dropdown">
                    <button (click)="goToProfile()">Profile</button>
                </div>
            </div>
        </header>

        <section>
            <section class="results"></section>
            <app-housing-location
                    *ngFor="let housingLocation of filteredLocationList"
                    [housingLocation]="housingLocation">
            </app-housing-location>
        </section>
        
        <footer class="add-house-footer">
            <button class="primary add-house-btn" (click)="goToAddHouse()">Nuova Casa</button>
        </footer>
    `,
    styleUrls: ['./home.component.css'] //style css
})

export class HomeComponent implements OnInit {
    housingLocationList: HousingLocation[] = []; // lista completa abitazioni
    filteredLocationList: HousingLocation[] = []; //lista mostrata dopo il filter
    menuOpen = false;


    constructor(private router: Router, private housingService: HousingService) {
    }

    ngOnInit() {
        this.housingService.getAllHousingLocations().subscribe({
            next: (data) => {
                this.housingLocationList = data;
                this.filteredLocationList = data;
            },
            error: (err) => console.error('errore:', err)
        });
    }

    filterResults(text: string) {
        if (!text) this.filteredLocationList = this.housingLocationList;
        // se filtro vuoto mostra tutto
        this.filteredLocationList = this.housingLocationList.filter(
            location => location?.city.toLowerCase().includes(text.toLowerCase())
            // filtro case-insensitive sul campo "city", trova tutte le stringe della città dal testo scritto dall'utente
        );
    }

    toggleMenu() {
        this.menuOpen = !this.menuOpen;
    }

    goToProfile() {
        this.router.navigate(['/profile']);
    }

    goToAddHouse() {
        this.router.navigate(['/add-house']);

    }
}
