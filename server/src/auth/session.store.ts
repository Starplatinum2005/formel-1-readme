import { Injectable } from '@nestjs/common';
import { Role } from '../users/users.service';

export type SessionData = {
  userId: string;
  email: string;
  role: Role;
  createdAt: number;
};

@Injectable()
export class SessionStore {
  private sessions = new Map<string, SessionData>();

  create(token: string, data: SessionData) {
    this.sessions.set(token, data);
  }

  get(token: string): SessionData | undefined {
    return this.sessions.get(token);
  }

  delete(token: string) {
    this.sessions.delete(token);
  }
}
