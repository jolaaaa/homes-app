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
        <div class="container">
            <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="register-form">
                <h2>Registrazione</h2>
                <div *ngIf="error" class="error">{{ error }}</div>
                <div *ngIf="success" class="success">{{ success }}</div>
                <input type="email" formControlName="email" placeholder="Email"/>
                <input type="password" formControlName="password" placeholder="Password"/>
                <input type="password" formControlName="confirmPassword" placeholder="Conferma Password"/>
                <button type="submit">Registrati</button>
            </form>
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
