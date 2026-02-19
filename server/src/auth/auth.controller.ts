import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SessionStore } from "./session.store";
import { RegisterDto } from "./dto/register.dto";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly sessionStore: SessionStore
  ) {}

  @Post("register")
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post("login")
  login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }

  @Get("me")
  me(@Headers("x-session-token") token?: string) {
    if (!token) throw new UnauthorizedException("Nicht eingeloggt");

    const session = this.sessionStore.get(token);
    if (!session) throw new UnauthorizedException("Session ungültig");

    return { email: session.email, role: session.role };
  }
}
