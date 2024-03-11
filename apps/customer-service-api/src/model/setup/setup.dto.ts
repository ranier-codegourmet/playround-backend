import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsInstance,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  ValidateNested,
} from 'class-validator';

class CreateUserDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsNotEmpty()
  @IsString()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  @ApiProperty({
    description:
      'Password must be at least 8 characters long and contain at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 special character',
  })
  password: string;
}

export class CreateOrganizationDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name: string;
}

export class SetupOrganizationDTO {
  @ValidateNested()
  @Type(() => CreateUserDTO)
  @IsInstance(CreateUserDTO, { each: true, message: 'user is required' })
  @ApiProperty({ type: CreateUserDTO })
  user: CreateUserDTO;

  @ValidateNested()
  @Type(() => CreateOrganizationDTO)
  @IsInstance(CreateOrganizationDTO, {
    each: true,
    message: 'organization is required',
  })
  @ApiProperty({ type: CreateOrganizationDTO })
  organization: CreateOrganizationDTO;
}
