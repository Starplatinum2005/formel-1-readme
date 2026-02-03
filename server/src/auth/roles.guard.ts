import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { SessionStore } from './session.store';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private sessionStore: SessionStore) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const token = req.headers['x-session-token'] as string | undefined;

    // GET ist öffentlich
    if (req.method === 'GET') return true;

    // Schreibende Requests brauchen Session
    if (!token) throw new UnauthorizedException('Nicht angemeldet');

    const session = this.sessionStore.get(token);
    if (!session) throw new UnauthorizedException('Session ungültig/abgelaufen');

    // Nur Admin darf schreiben (POST/DELETE – ggf. PUT/PATCH ergänzen)
    if (req.method === 'POST' || req.method === 'DELETE') {
      if (session.role !== 'admin') {
        throw new UnauthorizedException('Nur Admins dürfen Produkte verändern!');
      }
    }

    return true;
  }
}
