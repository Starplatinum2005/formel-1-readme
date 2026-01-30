import { Body, Controller, Post, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }

  // optional
  @Post('logout')
  logout(@Headers('x-session-token') token: string) {
    return this.authService.logout(token);
  }
}
