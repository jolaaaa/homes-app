import {Component} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {NgIf} from "@angular/common";
import {AuthService} from "./AuthService";

@Component({
    selector: 'app-registration',
    standalone: true,
    styleUrls: ['./register.component.css'],
    imports: [ReactiveFormsModule, NgIf],
    template: `
        <div class="container d-flex justify-content-center align-items-center min-vh-100">
            <div class="card p-4 shadow-sm" style="max-width: 400px; width: 100%;">
                <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
                    <h2 class="text-center mb-4">Registrazione</h2>

                    <!-- Messaggi di errore -->
                    <div *ngIf="error" class="alert alert-danger p-2 text-center">{{ error }}</div>
                    <div *ngIf="success" class="alert alert-success p-2 text-center">{{ success }}</div>

                    <div class="mb-3">
                        <label class="form-label">Email</label>
                        <input type="email" class="form-control" formControlName="email" placeholder="Inserisci la tua email" />
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Password</label>
                        <input type="password" class="form-control" formControlName="password" placeholder="Inserisci la password" />
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Conferma Password</label>
                        <input type="password" class="form-control" formControlName="confirmPassword" placeholder="Conferma la password" />
                    </div>

                    <button type="submit" class="btn btn-primary w-100">Registrati</button>
                </form>
            </div>
        </div>

    `
})

export class RegistrationComponent {
    registerForm: FormGroup;
    error: string | null = null;
    success: string | null = null;

    constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) {
        this.registerForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(4)]],
            confirmPassword: ['', [Validators.required]]
        });
    }

    submitRegister() {
        const {email, password} = this.registerForm.value;
        this.authService.register(email, password).subscribe({
            next: res => {
                console.log('Registrazione completata', res);
            },
            error: err => console.error('Errore registrazione: ', err),
        })
    }


    onSubmit(): void {
        if (this.registerForm.valid) {
            const {email, password, confirmPassword} = this.registerForm.value;

            if (password !== confirmPassword) {
                this.error = 'Le password non coincidono';
                return;
            }

            // Chiama AuthService per salvare sia nel localStorage che nel backend
            this.authService.register(email!, password!).subscribe({
                next: (res) => {
                    console.log('Risposta backend:', res);
                    this.success = 'Registrazione completata! Puoi fare login.';
                    this.error = null;

                    setTimeout(() => {
                        this.router.navigate(['/']);
                    }, 2000);
                },
                error: (err) => {
                    this.error = err.error?.message || 'Errore durante la registrazione.';
                    console.error(err);
                }
            });
        }
    }
}
