import {Component} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {NgIf} from "@angular/common";

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

    constructor(private fb: FormBuilder, private router: Router) {
        this.registerForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(4)]],
            confirmPassword: ['', [Validators.required]]
        });
    }

    onSubmit(): void {
        if (this.registerForm.valid) {
            const {email, password, confirmPassword} = this.registerForm.value;

            if (password !== confirmPassword) {
                this.error = 'Le password non coincidono';
                return;
            }

            const usersJson = localStorage.getItem('registeredUsers');
            const users = usersJson ? JSON.parse(usersJson) : [];

            if (users.some((u: any) => u.email === email)) {
                this.error = 'Utente già registrato';
                return;
            }
            // aggiunge il nuovo utente al localStorage
            users.push({email, password});
            localStorage.setItem('registeredUsers', JSON.stringify(users));


            this.success = 'Registrazione completata! Puoi fare login.';
            this.error = null;

            //  redirect al login
            setTimeout(() => {
                this.router.navigate(['/']);
            }, 2000);
        }
    }
}
