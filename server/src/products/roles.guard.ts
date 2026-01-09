import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    // Wir lesen den Header 'x-role' aus
    const userRole = request.headers['x-role'];

    // Wenn der Pfad POST oder DELETE ist, muss die Rolle 'admin' sein
    if (request.method === 'POST' || request.method === 'DELETE') {
      if (userRole !== 'admin') {
        throw new UnauthorizedException('Nur Admins dürfen Produkte verändern!');
      }
    }

    return true; // Gast darf alles andere (GET)
  }
}