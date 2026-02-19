import { Injectable } from "@nestjs/common";

export type Session = {
  email: string;
  role: "admin" | "user";
};

@Injectable()
export class SessionStore {
  private readonly sessions = new Map<string, Session>();

  set(token: string, session: Session) {
    this.sessions.set(token, session);
  }

  get(token: string): Session | undefined {
    return this.sessions.get(token);
  }

  delete(token: string) {
    this.sessions.delete(token);
  }
}
