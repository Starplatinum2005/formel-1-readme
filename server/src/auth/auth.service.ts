import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { SessionStore } from './session.store';
import { randomUUID } from 'crypto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private sessionStore: SessionStore,
    ) { }

    // src/auth/auth.service.ts
    login(email: string, password: string) {
        const user = this.usersService.findByEmail(email);
        if (!user || user.password !== password) {
            throw new UnauthorizedException('Login fehlgeschlagen');
        }

        const token = randomUUID();

        // WICHTIG: Erstelle ein Objekt OHNE das Passwort für den Store
        const sessionData = {
            userId: user.id,
            email: user.email,
            role: user.role,
            createdAt: Date.now(),
        };

        this.sessionStore.create(token, sessionData);

        // Gib nur die nötigen Infos an den Client zurück
        return { token, email: user.email, role: user.role };
    }

    logout(token: string) {
        this.sessionStore.delete(token);
        return { ok: true };
    }
}