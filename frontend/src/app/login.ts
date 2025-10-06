import {Component} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgIf} from "@angular/common";
import {RouterLink} from "@angular/router";
import {Router} from "@angular/router";

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

    constructor(private fb: FormBuilder, private router: Router) {
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

            const usersJson = localStorage.getItem('registeredUsers');
            const users = usersJson ? JSON.parse(usersJson) : [];

            // cerca nelle credenziali registrate o hardcoded
            const matchedUser = users.find((u: any) => u.email === email && u.password === password)
                || this.validCredentials.find(u => u.email === email && u.password === password);

            if (matchedUser) {
                // salva in localStorage
                localStorage.setItem('user', JSON.stringify({email}));
                // naviga alla home page
                this.router.navigate(['/home']);
            } else {
                this.error = 'Credenziali non valide';
            }
        }
    }
}
