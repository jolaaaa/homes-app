// componente figlio di HomeComponent
import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HousingLocation} from "../housing-location";
import {RouterModule} from "@angular/router";

@Component({
    selector: 'app-housing-location',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
        <section class="listing">
            <div class="text-center">
                <img class="img-fluid" [src]="housingLocation.photo" alt="Exterior photo of
{{housingLocation.photo}}">
                <h2 class="listing-heading">{{ housingLocation.name }}</h2>
                <p class="listing-location">{{ housingLocation.city }},{{ housingLocation.state }}</p>
                <a [routerLink]="['/details', housingLocation.id]">Learn More</a>
                <!-- apre la pagina dei dettagli (/details/:id)-->
            </div>
        </section>
    `,
    styleUrls: ['./housing-location.component.css']
})
export class HousingLocationComponent {
    @Input() housingLocation!: HousingLocation;
    // housingLocation obbligatorio (not null assertion !)
}
