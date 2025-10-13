import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import * as fs from 'fs';
import * as bcrypt from 'bcrypt';
import {User} from './user.entity';
import * as path from 'path';

@Injectable()
export class UserSeederService {
    constructor(@InjectRepository(User) private userRepo: Repository<User>,
    ) {
    }

    async seed() {
        try {
            const usersFile = path.join(process.cwd(), 'users.json');

            if (!fs.existsSync(usersFile)) {
                console.warn('⚠️ Nessun file users.json trovato.');
                return;
            }

            const data = fs.readFileSync(usersFile, 'utf-8');
            const users = JSON.parse(data);

            for (const u of users) {
                const normalizedEmail = u.email.trim().toLowerCase();

                const existing = await this.userRepo.findOne({where: {email: normalizedEmail}});
                if (existing) {
                    console.log(`⏭️ Utente ${normalizedEmail} già presente, salto.`);
                    continue;
                }

                const hashedPassword = await bcrypt.hash(u.password, 10);

                const user = this.userRepo.create({
                    email: normalizedEmail,
                    password: hashedPassword
                });

                await this.userRepo.save(user);
                console.log(`Utente ${normalizedEmail} inserito!`);
            }

            console.log('Tutti gli utenti sono stati importati con successo!');
        } catch (err) {
            console.error('Errore durante l’importazione utenti:', err);
        }
    }
}