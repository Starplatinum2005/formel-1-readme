import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { SessionStore } from './session.store';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly sessionStore: SessionStore) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();

    // Produkte ansehen darf jeder
    if (req.method === 'GET') return true;

    const token = req.headers['x-session-token'];
    if (!token) {
      throw new UnauthorizedException('Nicht eingeloggt');
    }

    const session = this.sessionStore.get(token);
    if (!session) {
      throw new UnauthorizedException('Session abgelaufen');
    }

    // Nur Admin darf Produkte verändern
    if (session.role !== 'admin') {
      throw new ForbiddenException('Nur Admins erlaubt');
    }

    return true;
  }
}
