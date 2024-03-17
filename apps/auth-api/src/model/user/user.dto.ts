import { AtLeastOneFieldRequired } from '@repo/nest-custom-validator';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateUserDTO {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @AtLeastOneFieldRequired(['firstName', 'lastName', 'gender', 'email'])
  dummyField = '';
}
