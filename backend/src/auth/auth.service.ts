import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwt: JwtService) {}

  generateToken(userId: string): { token: string } {
    const payload = { userId };
    return { token: this.jwt.sign(payload) };
  }

  verifyToken(token: string): { userId: string } {
    try {
      return this.jwt.verify<{ userId: string }>(token);
    } catch {
      throw new Error('Token inválido ou expirado');
    }
  }
}
