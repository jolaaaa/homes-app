import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import * as path from 'path';


@Injectable()
export class AuthService {
    private readonly authService = AuthService;
    private usersFile = path.join(process.cwd(), 'users.json');


    constructor(
        @InjectRepository(User)
        private userRepo: Repository<User>,
    ) {
    }

    private readUsersFromJson(): any[] {
        if (!fs.existsSync(this.usersFile)) return [];
        const data = fs.readFileSync(this.usersFile, 'utf-8');
        return JSON.parse(data);
    }

    private saveUserToJson(user: any) {
        const users = this.readUsersFromJson();
        users.push(user);
        fs.writeFileSync(this.usersFile, JSON.stringify(users, null, 2));
    }

    async register(dto: { email: string; password: string }) {
        const existing = await this.userRepo.findOne({where: {email: dto.email}});
        if (existing) {
            throw new HttpException('Utente già registrato', HttpStatus.CONFLICT);
        }

        const hashedPassword = await bcrypt.hash(dto.password, 10);
        const newUser = this.userRepo.create({
            email: dto.email,
            password: hashedPassword,
        });

        await this.userRepo.save(newUser);

        // salva nel file json
        this.saveUserToJson({email: dto.email, password: hashedPassword});

        return {
            message: 'Registrazione completata',
            accessToken: 'fake-jwt-token-for-' + dto.email,
            user: {email: dto.email},
        };
    }

    async login(dto: { email: string; password: string }) {
        const user = await this.userRepo.findOne({where: {email: dto.email}});
        if (!user) {
            throw new HttpException('Utente non trovato', HttpStatus.UNAUTHORIZED);
        }

        const passwordOk = await bcrypt.compare(dto.password, user.password);
        if (!passwordOk) {
            throw new HttpException('Password errata', HttpStatus.UNAUTHORIZED);
        }

        return {
            message: 'Login riuscito',
            accessToken: 'fake-jwt-token-for-' + user.email,
            user: {email: user.email},
        };
    }
}
