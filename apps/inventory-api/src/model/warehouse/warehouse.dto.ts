import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateWarehouseDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name: string;
}
