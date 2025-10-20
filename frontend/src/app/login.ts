import {Component} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgIf} from "@angular/common";
import {RouterLink} from "@angular/router";
import {Router} from "@angular/router";
import {AuthService} from "./AuthService";

@Component({
    selector: 'app-login',
    standalone: true,
    styleUrls: ['./login.component.css'],
    imports: [ReactiveFormsModule, NgIf, RouterLink],
    template: `
        <div class="container d-flex justify-content-center align-items-center min-vh-100">
            <div class="card p-4 shadow-sm" style="max-width: 400px; width: 100%;">
                <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
                    <h2 class="text-center mb-4">Login</h2>

                    <div *ngIf="error" class="alert alert-danger p-2 text-center">{{ error }}</div>

                    <div class="mb-3">
                        <label class="form-label">Email</label>
                        <input type="email" class="form-control" formControlName="email" placeholder="Inserisci la tua email"/>
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Password</label>
                        <input type="password" class="form-control" formControlName="password" placeholder="Inserisci la password"/>
                    </div>

                    <button type="submit" class="btn btn-primary w-100">Accedi</button>

                    <p class="text-center mt-3">
                        Non hai un account?
                        <a [routerLink]="['/register']">Registrati</a>
                    </p>
                </form>
            </div>
        </div>

    `
})

export class LoginComponent {
    loginForm: FormGroup;
    error: string | null = null;
    private validCredentials = [
        {email: 'admin@example.com', password: 'admin123'},
        {email: 'user@example.com', password: 'user123'}
    ];

    private user: any;
    private isLoggedIn: boolean | undefined;

    constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required]]
        });

        // controllo se esiste già un utente salvato
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            this.user = JSON.parse(savedUser);
            this.isLoggedIn = true;
        }
    }

    onSubmit(): void {
        if (this.loginForm.valid) {
            const {email, password} = this.loginForm.value;

            this.authService.login(email, password).subscribe({
                next: res => {
                    console.log('Login con successo', res);

                    localStorage.setItem('accessToken', res.accessToken);
                    localStorage.setItem('user', JSON.stringify(res.user));

                    this.error = null;

                    this.router.navigate(['/home'], {replaceUrl: true});
                },
                error: err => {
                    console.error('Errore login: ', err);
                    this.error = err.error?.message || 'Credenziali non valide';
                }
            });
        }
    }

}


