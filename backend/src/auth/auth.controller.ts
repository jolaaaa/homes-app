import {Controller, Body, Post, HttpException, HttpStatus} from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

interface User {
    email: string;
    password: string;
}

@Controller('auth')
export class AuthController {
    private usersFile = path.join(process.cwd(), 'users.json'); // crea il file nella root del progetto

    private readUsers(): User[] {
        if (!fs.existsSync(this.usersFile)) {
            fs.writeFileSync(this.usersFile, JSON.stringify([])); // crea file se non esiste
        }
        const data = fs.readFileSync(this.usersFile, 'utf-8');
        return JSON.parse(data);
    }

    private saveUsers(users: User[]) {
        fs.writeFileSync(this.usersFile, JSON.stringify(users, null, 2));
    }

    @Post('register')
    register(@Body() newUser: User) {
        const users = this.readUsers();
        const exists = users.find((u) => u.email === newUser.email);

        if (exists) {
            throw new HttpException('Utente già registrato', HttpStatus.CONFLICT);
        }

        users.push(newUser);
        this.saveUsers(users);

        return {
            message: 'Registrazione completata',
            accessToken: 'fake-jwt-token-for-' + newUser.email,
            user: {email: newUser.email},
        };
    }

    @Post('login')
    login(@Body() credentials: { email: string; password: string }) {
        console.log('login preso dal backend: ',credentials.email);

        const users = this.readUsers();
        const user = users.find(
            (u) =>
                u.email === credentials.email &&
                u.password === credentials.password,
        );

        if (!user) {
            throw new HttpException('Credenziali non valide', HttpStatus.UNAUTHORIZED);
        }

        return {
            message: 'Login riuscito',
            accessToken: 'fake-jwt-token-for-' + user.email,
            user: {email: user.email},
        };
    }
}
