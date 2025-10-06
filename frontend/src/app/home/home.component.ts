import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HousingLocationComponent} from "../housing-location/housing-location.component";
import {HousingLocation} from "../housing-location";
import {HousingService} from "../housing.service";
import {Router} from "@angular/router";

@Component({
    selector: 'app-home', // nome tag HTML per questo componente
    standalone: true,
    imports: [CommonModule, HousingLocationComponent,],
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
                    <button (click)="logout()">Logout</button>
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

    `,
    styleUrls: ['./home.component.css'] //style css
})
export class HomeComponent {
    housingLocationList: HousingLocation[] = []; // lista completa abitazioni
    housingService: HousingService = inject(HousingService); // ottiene servizio con inject
    filteredLocationList: HousingLocation[] = []; //lista mostrata dopo il filter
    menuOpen = false;


    constructor(private router: Router) {
        // recupera le abitazioni quando il componente viene creato
        this.housingService.getAllHousingLocations().then((housingLocationList: HousingLocation[]) => {
            this.housingLocationList = housingLocationList;
            this.filteredLocationList = housingLocationList;
        });
    }

    filterResults(text: string) {
        if (!text) this.filteredLocationList = this.housingLocationList;
        // se filtro vuoto mostra tutto
        this.filteredLocationList = this.housingLocationList.filter(
            housingLocation => housingLocation?.city.toLowerCase().includes(text.toLowerCase())
            // filtro case-insensitive sul campo "city", trova tutte le stringe della città dal testo scritto dall'utente
        );
    }

    toggleMenu() {
        this.menuOpen = !this.menuOpen;
    }

    goToProfile() {
        this.router.navigate(['/profile']);
    }

    logout() {
        localStorage.removeItem('user');   // esempio: rimuove l'utente
        localStorage.removeItem('token');
        this.router.navigate(['/']);
    }
}
