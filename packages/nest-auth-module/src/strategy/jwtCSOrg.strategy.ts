import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { OrganizationTypeEnum } from '@repo/nest-organization-module';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtCSOrgStrategy extends PassportStrategy(Strategy, 'jwtCSOrg') {
  constructor(protected readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      algorithms: ['RS256'],
      secretOrKey: configService.get('AUTH_PUBLIC_KEY'),
    });
  }

  async validate(payload: any) {
    if (payload.organization.type !== OrganizationTypeEnum.SERVICE) {
      throw new UnauthorizedException(
        'Organization is not allowed to access this resource.',
      );
    }

    return {
      organization: payload.organization,
      user: payload.user,
    };
  }
}
