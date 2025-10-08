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
        <div class="container">
            <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
                <h2>Login</h2>
                <div *ngIf="error" class="error">{{ error }}</div>
                <input type="email" formControlName="email" placeholder="Email"/>
                <input type="password" formControlName="password" placeholder="Password"/>
                <button type="submit">Accedi</button>
                <p class="register-link">
                    Non hai un account?
                    <a [routerLink]="['/register']">Registrati</a>
                </p>
            </form>
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
                    console.log('Login con successo', res)
                    localStorage.setItem('accessToken', res.accessToken);
                    localStorage.setItem('user', JSON.stringify(res.user));

                    this.error = null;
                    this.router.navigate(['/home']);
                },
                error: (err) => {
                    console.error('Errore login: ', err);
                    this.error = err.error?.message || 'Credenziali non valide'
                }
            });
        }
    }
}

