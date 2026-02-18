import { Controller, Post, Body, Get, Headers, UnauthorizedException } from '@nestjs/common';
import { SessionStore } from './session.store';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly sessionStore: SessionStore,
  ) { }

  @Post('login')
  login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }

  @Get('me')
  me(@Headers('x-session-token') token?: string) {
    if (!token) {
      throw new UnauthorizedException('Nicht eingeloggt');
    }

    const session = this.sessionStore.get(token);
    if (!session) {
      throw new UnauthorizedException('Session ungültig');
    }

    return {
      email: session.email,
      role: session.role,
    };
  }


  // optional
  @Post('logout')
  logout(@Headers('x-session-token') token: string) {
    return this.authService.logout(token);
  }
}
