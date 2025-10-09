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
            <h2>👤 User Profile</h2>
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
