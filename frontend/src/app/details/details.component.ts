import { Component, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ActivatedRoute} from "@angular/router";
import {HousingService} from "../housing.service";
import {HousingLocation} from "../housing-location";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  providers:[HousingService],
  template: `
    <article>
      <img class="listing-photo" [src]="housingLocation?.photo" alt="Foto di {{housingLocation?.name}}">
      <section class="listing-description">
        <h2 class="listing-heading">{{housingLocation?.name}}</h2>
        <p class="listing-location">{{housingLocation?.city}}, {{housingLocation?.state}}</p>
      </section>
      <section class="listing-features">
        <h2 class="section-heading">About this location</h2>
        <ul>
          <li>Units available: {{housingLocation?.availableUnits}}</li>
          <li>Does this location have wifi: {{housingLocation?.wifi}}</li>
          <li>Does this location have laundry: {{housingLocation?.laundry}}</li>
        </ul>
      </section>
      <section class="listing-apply">
        <h2 class="section-heading">Apply now to live here</h2>
        <form [formGroup]="applyForm" (submit)="submitApplication()">
          <label for="first-name">First Name</label>
          <input id="first-name" type="text" formControlName="firstName"> <!-- input da tastiera -->

          <label for="last-name">Last Name</label>
          <input id="last-name" type="text" formControlName="lastName"> <!-- input da tastiera -->

          <label for="email">Email</label>
          <input id="email" type="email" formControlName="email"> <!-- input da tastiera -->
          <button type="submit" class="primary">Apply Now</button>
        </form>
      </section>
    </article>
  `,
  styleUrls: ['./details.component.css']
})

export class DetailsComponent {
  // inject dei servizi
  route: ActivatedRoute=inject(ActivatedRoute);
  housingService=inject (HousingService);
  // oggetto location corrente
  housingLocation: HousingLocation | undefined;
  // form: FormGroup
  applyForm=new FormGroup(
      {
        firstName:new FormControl(''),
        lastName:new FormControl(''),
        email:new FormControl('')
      }
  )

  constructor() {
    // legge id della location dai parametri della route
    const housingLocationId=Number(this.route.snapshot.params['id']);
    // recupero dati
    this.housingService.getHousingLocationById(housingLocationId).subscribe({
      next: (housingLocation) => (this.housingLocation = housingLocation),
      error :(err)=> console.error('Errore nel caricamento: ', err),
    });
  }
  // metodo che invia i dati del form
  submitApplication(){
    this.housingService.submitApplication(
        this.applyForm.value.firstName ?? '',
        this.applyForm.value.lastName ?? '',
        this.applyForm.value.email ?? ''
    )
  }
}

