import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from "@angular/router";
import { HousingService } from "../housing.service";
import { HousingLocation } from "../housing-location";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  providers: [HousingService],
  template: `
    <article *ngIf="housingLocation">
      <img class="listing-photo" [src]="housingLocation.photo" alt="Foto di {{housingLocation.name}}">

      <section class="listing-description">
        <h2 class="listing-heading">{{housingLocation.name}}</h2>
        <p class="listing-location">{{housingLocation.city}}, {{housingLocation.state}}</p>
      </section>

      <section class="listing-features">
        <h2 class="section-heading">About this location</h2>
        <ul>
          <li>Units available: {{housingLocation.availableUnits}}</li>
          <li>Wifi: {{housingLocation.wifi}}</li>
          <li>Laundry: {{housingLocation.laundry}}</li>
        </ul>
      </section>

      <section class="listing-apply">
        <h2 class="section-heading">Apply now to live here</h2>
        <form [formGroup]="applyForm" (ngSubmit)="submitApplication()">
          <label for="first-name">First Name</label>
          <input id="first-name" type="text" formControlName="firstName" required>

          <label for="last-name">Last Name</label>
          <input id="last-name" type="text" formControlName="lastName" required>

          <label for="email">Email</label>
          <input id="email" type="email" formControlName="email" required>

          <button type="submit" class="primary" [disabled]="applyForm.invalid">Apply Now</button>
        </form>

        <p *ngIf="message" class="success">{{ message }}</p>
        <p *ngIf="error" class="error">{{ error }}</p>
      </section>
    </article>
  `,
  styleUrls: ['./details.component.css']
})
export class DetailsComponent {
  route: ActivatedRoute = inject(ActivatedRoute);
  housingService = inject(HousingService);

  housingLocation: HousingLocation | undefined;

  applyForm = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    email: new FormControl('')
  });

  message = '';
  error = '';

  constructor() {
    const housingLocationId = Number(this.route.snapshot.params['id']);
    this.housingService.getHousingLocationById(housingLocationId).subscribe({
      next: (housingLocation) => (this.housingLocation = housingLocation),
      error: (err) => console.error('Errore nel caricamento: ', err),
    });
  }

  submitApplication() {
    if (!this.applyForm.valid || !this.housingLocation) return;

    const { firstName, lastName, email } = this.applyForm.value;

    // invia i dati con il nome della casa
    this.housingService.submitApplication(firstName ?? '', lastName ?? '', email ?? '', this.housingLocation.name)
        .subscribe({
          next: (res) => {
            //this.message = res.message;
            this.error = '';
            this.applyForm.reset();
          },
          error: (err) => {
            console.error(err);
            this.error = '❌ Errore durante il salvataggio!';
            this.message = '';
          }
        });
  }
}
