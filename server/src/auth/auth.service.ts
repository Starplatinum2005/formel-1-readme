import { Injectable, ConflictException, UnauthorizedException } from "@nestjs/common";
import * as fs from "fs";
import * as path from "path";
import { randomUUID } from "crypto";
import { SessionStore } from "./session.store";
import { RegisterDto } from "./dto/register.dto";

type User = {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
    role: "admin" | "user";
};


@Injectable()
export class AuthService {
    private readonly usersPath = "./data/users.json";

    constructor(private readonly sessionStore: SessionStore) { }

    private readUsers(): User[] {
        if (!fs.existsSync(this.usersPath)) {
            fs.mkdirSync(path.dirname(this.usersPath), { recursive: true });
            fs.writeFileSync(this.usersPath, JSON.stringify([], null, 2));
        }
        const content = fs.readFileSync(this.usersPath, "utf-8");
        try {
            return JSON.parse(content);
        } catch {
            return [];
        }
    }

    private writeUsers(users: User[]) {
        fs.writeFileSync(this.usersPath, JSON.stringify(users, null, 2));
    }

    register(dto: RegisterDto) {
        const firstName = (dto.firstName ?? "").trim();
        const lastName = (dto.lastName ?? "").trim();
        const username = (dto.username ?? "").trim();
        const email = (dto.email ?? "").trim().toLowerCase();
        const password = (dto.password ?? "").trim();

        if (!firstName || !lastName || !username || !email || !password) {
            throw new ConflictException("Bitte alle Felder ausfüllen");
        }

        const users = this.readUsers();

        // E-Mail darf nur einmal existieren
        if (users.some(u => u.email.toLowerCase() === email)) {
            throw new ConflictException("E-Mail ist bereits registriert");
        }

        // Username darf nur einmal existieren
        if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
            throw new ConflictException("Benutzername bereits vergeben");
        }

        const newUser: User = {
            firstName,
            lastName,
            username,
            email,
            password,
            role: "user",
        };

        users.push(newUser);
        this.writeUsers(users);

        return {
            created: true,
            email: newUser.email,
            username: newUser.username,
            role: newUser.role,
        };
    }


    login(email: string, password: string) {
        const e = (email ?? "").trim().toLowerCase();
        const p = (password ?? "").trim();

        const users = this.readUsers();
        const user = users.find((u) => u.email.toLowerCase() === e);

        if (!user || user.password !== p) {
            throw new UnauthorizedException("Login fehlgeschlagen");
        }

        const token = randomUUID();
        this.sessionStore.set(token, { email: user.email, role: user.role });

        return { token, email: user.email, role: user.role };
    }
}
