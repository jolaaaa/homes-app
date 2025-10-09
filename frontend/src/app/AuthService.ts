// auth.service.ts
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, tap} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = 'http://localhost:3000/auth';

    constructor(private http: HttpClient) {
    }

    register(email: string, password: string): Observable<any> {

        const usersJson = localStorage.getItem('registeredUsers');
        const users = usersJson ? JSON.parse(usersJson) : [];
        users.push({email, password});
        localStorage.setItem('registeredUsers', JSON.stringify(users));


        return this.http.post(`${this.apiUrl}/register`, {email, password}).pipe(
            tap({
                next: res => console.log('Utente registrato nel backend:', res),
                error: err => console.error('Errore backend:', err)
            })
        );
    }

    login(email: string, password: string): Observable<any> {
        console.log('Login: invio richiesta al backend');
        return this.http.post(`${this.apiUrl}/login`, {email, password}).pipe(
            tap({
                next: res => console.log('risposta backend', res),
                error: err => console.log('errore backend', err)
            })
        )
    }

    logout(): void {
        localStorage.removeItem('userId');
    }
}
