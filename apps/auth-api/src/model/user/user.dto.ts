import { ApiProperty } from '@nestjs/swagger';
import { AtLeastOneFieldRequired } from '@repo/nest-custom-validator';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateUserDTO {
  @IsOptional()
  @IsString()
  @ApiProperty()
  firstName: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  lastName: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  gender: string;

  @IsOptional()
  @IsEmail()
  @ApiProperty()
  email: string;

  @AtLeastOneFieldRequired(['firstName', 'lastName', 'gender', 'email'])
  dummyField = '';
}
