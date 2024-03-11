import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtOrgStrategy extends PassportStrategy(Strategy, 'jwtOrg') {
  constructor(protected readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      algorithms: ['RS256'],
      secretOrKey: configService.get('AUTH_PUBLIC_KEY'),
    });
  }

  async validate(payload: any) {
    return {
      organization: payload.organization,
      user: payload.user,
    };
  }
}
