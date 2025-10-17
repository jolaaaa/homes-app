import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HousingService } from './housing.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
    selector: 'app-add-house',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
    providers: [HousingService],
    template: `
    <section class="add-house">
      <h2>Aggiungi una nuova casa</h2>

      <form [formGroup]="houseForm" (ngSubmit)="onSubmit()" enctype="multipart/form-data">
        <label for="name">Nome</label>
        <input id="name" type="text" formControlName="name" placeholder="Nome della casa" required>

        <label for="city">Città</label>
        <input id="city" type="text" formControlName="city" placeholder="Città" required>

        <label for="state">Stato</label>
        <input id="state" type="text" formControlName="state" placeholder="Stato" required>

        <label for="availableUnits">Unità disponibili</label>
        <input id="availableUnits" type="number" formControlName="availableUnits" required>

        <label for="wifi">Wi-Fi</label>
        <select id="wifi" formControlName="wifi">
          <option value="true">Disponibile</option>
          <option value="false">Non disponibile</option>
        </select>

        <label for="laundry">Lavanderia</label>
        <select id="laundry" formControlName="laundry">
          <option value="true">Disponibile</option>
          <option value="false">Non disponibile</option>
        </select>
          
        <label for="photo">Immagine</label>
        <input id="photo" type="file" (change)="onFileSelected($event)" accept="image/*">

        
        <div *ngIf="previewUrl" class="preview">
          <p>Anteprima:</p>
          <img [src]="previewUrl" alt="Anteprima immagine" class="preview-img">
        </div>

        <button class="primary" type="submit" [disabled]="houseForm.invalid">Salva casa</button>
      </form>

      <p *ngIf="message" class="success">{{ message }}</p>
      <p *ngIf="error" class="error">{{ error }}</p>
    </section>
  `,
    styleUrls: ['./add-house.component.css']
})
export class AddHouseComponent {
    houseForm = new FormGroup({
        name: new FormControl('', Validators.required),
        city: new FormControl('', Validators.required),
        state: new FormControl('', Validators.required),
        availableUnits: new FormControl(1, Validators.required),
        wifi: new FormControl('true'),
        laundry: new FormControl('true')
    });

    selectedFile: File | null = null;
    previewUrl: string | null = null;
    message = '';
    error = '';

    constructor(private housingService: HousingService, private router: Router) {}

    onFileSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        if (!input.files || input.files.length === 0) return;

        this.selectedFile = input.files[0];

        // anteprima immagine
        const reader = new FileReader();
        reader.onload = () => {
            this.previewUrl = reader.result as string;
        };
        reader.readAsDataURL(this.selectedFile);
    }

    onSubmit() {
        if (!this.houseForm.valid) return;

        // converto i valori in tipi corretti
        const newLocation = {
            name: this.houseForm.value.name ?? '',
            city: this.houseForm.value.city ?? '',
            state: this.houseForm.value.state ?? '',
            availableUnits: Number(this.houseForm.value.availableUnits ?? 0),
            wifi: this.houseForm.value.wifi === 'true',
            laundry: this.houseForm.value.laundry === 'true',
            photo: this.previewUrl || ''
        };

        this.housingService.addNewHouse(newLocation).subscribe({
            next: (res) => {
                this.message = 'Casa aggiunta';
                this.error = '';
                this.houseForm.reset();
                this.previewUrl = null;
                setTimeout(() => this.router.navigate(['/home']), 1500);
            },
            error: (err) => {
                console.error(err);
                this.error = 'Errore nel server';
                this.message = '';
            }
        });
    }


}
