import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtCSOrgAuthGuard extends AuthGuard('jwtCSOrg') {}
