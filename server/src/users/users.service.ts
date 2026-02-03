import { Injectable, ConflictException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { randomUUID } from 'crypto';

export type Role = 'user' | 'admin';
export type UserRecord = { id: string; email: string; password: string; role: Role };
// NEU: Ein Typ für den User ohne Passwort
export type UserSafe = Omit<UserRecord, 'password'>;

@Injectable()
export class UsersService {
  private filePath = path.join(__dirname, '../../data/users.json');

  private readUsers(): UserRecord[] {
    const raw = fs.readFileSync(this.filePath, 'utf-8');
    return JSON.parse(raw) as UserRecord[];
  }

  private writeUsers(users: UserRecord[]) {
    fs.writeFileSync(this.filePath, JSON.stringify(users, null, 2), 'utf-8');
  }

  // Nur für AuthService (Login) nutzen!
  findByEmail(email: string): UserRecord | undefined {
    return this.readUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  // Für alles andere nutzen (liefert kein Passwort)
  findSafeByEmail(email: string): UserSafe | undefined {
    const user = this.findByEmail(email);
    if (!user) return undefined;
    const { password, ...safeUser } = user;
    return safeUser;
  }

  createUser(email: string, password: string): UserSafe {
    const users = this.readUsers();
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      throw new ConflictException('E-Mail existiert bereits');
    }
    const newUser: UserRecord = { id: randomUUID(), email, password, role: 'user' };
    users.push(newUser);
    this.writeUsers(users);

    const { password: _, ...safeUser } = newUser;
    return safeUser;
  }
}