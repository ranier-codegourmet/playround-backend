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
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
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
  password: string;
}

export class CreateOrganizationDTO {
  @IsNotEmpty()
  @IsString()
  name: string;
}

export class SetupOrganizationDTO {
  @ValidateNested()
  @Type(() => CreateUserDTO)
  @IsInstance(CreateUserDTO, { each: true, message: 'user is required' })
  user: CreateUserDTO;

  @ValidateNested()
  @Type(() => CreateOrganizationDTO)
  @IsInstance(CreateOrganizationDTO, {
    each: true,
    message: 'organization is required',
  })
  organization: CreateOrganizationDTO;
}
