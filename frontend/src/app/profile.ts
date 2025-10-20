import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router} from "@angular/router";
import {AuthService} from "./AuthService";

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [CommonModule],
    template: `
        <section class="profile">
            <div class="d-flex align-items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor"
                     class="bi bi-person-circle" viewBox="0 0 16 16">
                    <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
                    <path fill-rule="evenodd"
                          d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
                </svg>
                <span class="fs-4 fw-semibold">Profile Page</span>
            </div>
            <p><strong>Email:</strong> {{ email }}</p>
            <button class="logout-btn" (click)="logout()">Logout</button>
        </section>
    `,
    styleUrls: ['./profile.css']
})


export class ProfileComponent {
    email: string | null = null;

    constructor(private router: Router, private authService: AuthService) {
    }

    ngOnInit(): void {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const userObj = JSON.parse(storedUser);
            this.email = userObj.email;  // prendi solo la mail*/
        }
    }


    logout(): void {
        localStorage.removeItem('user');
        this.router.navigate(['/']);
    }
}
