import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {AuthService} from "./AuthService";

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(private router: Router,private authService: AuthService) {}

    canActivate(): boolean {
        const user = localStorage.getItem('user');
        if (user) {
            return true;
        } else {
            this.router.navigate(['/']);
            return false;
        }
    }
}
