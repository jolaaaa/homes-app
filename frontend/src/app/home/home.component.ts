import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HousingLocationComponent} from "../housing-location/housing-location.component";
import {HousingLocation} from "../housing-location";
import {HousingService} from "../housing.service";
import {HttpClientModule} from "@angular/common/http";
import {Router} from "@angular/router";
import {FormsModule} from "@angular/forms";

@Component({
    selector: 'app-home', // nome tag HTML per questo componente
    standalone: true,
    imports: [CommonModule, HousingLocationComponent, HttpClientModule, FormsModule],
    providers: [HousingService],
    template: `
        <div class="container-fluid">
            <header class="header">
                <nav class="navbar navbar-expand-lg navbar-light bg-light">
                    <div class="container-fluid">
                        <button
                                class="navbar-toggler ms-auto"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#navbarContent"
                                aria-controls="navbarContent"
                                aria-expanded="false"
                                aria-label="Toggle navigation"
                        >
                            <span class="navbar-toggler-icon"></span>
                        </button>


                        <div class="collapse navbar-collapse" id="navbarContent">
                            <form
                                    class="d-flex mb-2 mb-lg-0 ms-auto me-3"
                                    (ngSubmit)="filterResults(filter.value)"
                            >
                                <input
                                        type="text"
                                        class="form-control me-2"
                                        placeholder="Filter by city"
                                        #filter
                                />
                                <button class="btn btn-primary" type="submit">Search</button>
                            </form>
                        </div>
                    </div>
                </nav>
            </header>

            <span class="user-icon" (click)="toggleMenu()">
    <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="currentColor"
            class="bi bi-person-circle"
            viewBox="0 0 16 16"
    >
      <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
      <path
              fill-rule="evenodd"
              d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"
      />
    </svg>
  </span>

            <div *ngIf="menuOpen" class="menu-dropdown">
                <button (click)="goToProfile()">Profile</button>
            </div>

            <section>
                <section class="results"></section>
                <app-housing-location
                        *ngFor="let housingLocation of filteredLocationList"
                        [housingLocation]="housingLocation"
                >
                </app-housing-location>
            </section>

            <footer class="add-house-footer">
                <button class="primary add-house-btn" (click)="goToAddHouse()">
                    Nuova Casa
                </button>
                <button class="primary add-house-btn" (click)="goToAllSubmissions()">
                    Tutte le submissions
                </button>
            </footer>

        </div>

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

    // metodo che porta alla pagina di tutte le submissions
    goToAllSubmissions() {
        this.router.navigate(['/submissions']);
    }
}
