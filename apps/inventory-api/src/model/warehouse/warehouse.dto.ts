import { PaginationDTO, SortOrderEnum } from '@repo/nest-basic-types';
import { AtLeastOneFieldRequired } from '@repo/nest-custom-validator';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsInstance,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

import { WarehouseSortFields } from './warehouse.interface';

export class CreateWarehouseDTO {
  @IsNotEmpty()
  @IsString()
  name: string;
}

export class UpdateWarehouseDTO {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  name?: string;

  @AtLeastOneFieldRequired(['name'])
  dummyField = '';
}

class WarehouseSortDTO {
  @IsNotEmpty()
  @IsString()
  @IsEnum(WarehouseSortFields)
  field: string;

  @IsNotEmpty()
  @IsEnum(SortOrderEnum)
  order: string;
}

export class WarehouseGridDTO {
  @IsOptional()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => PaginationDTO)
  @IsInstance(PaginationDTO, { each: true })
  pagination?: PaginationDTO;

  @IsOptional()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => WarehouseSortDTO)
  @IsInstance(WarehouseSortDTO, { each: true })
  @IsArray()
  sorts?: WarehouseSortDTO[];

  @IsOptional()
  @IsString()
  searchTerms?: string;
}
