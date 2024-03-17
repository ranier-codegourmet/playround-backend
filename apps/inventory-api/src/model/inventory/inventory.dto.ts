import { PaginationDTO, SortOrderEnum } from '@repo/nest-basic-types';
import { AtLeastOneFieldRequired } from '@repo/nest-custom-validator';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsCurrency,
  IsEnum,
  IsInstance,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

import { InventorySortFieldsEnum } from './inventory.interface';

export class CreateInventoryDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  sku?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  barcode?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  brand?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  model?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  color?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  weight?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  dimension?: string;

  @IsNotEmpty()
  @IsCurrency({ allow_decimal: true, require_symbol: false })
  price: string;

  @IsOptional()
  @ArrayNotEmpty()
  @ArrayUnique((id) => id)
  @IsMongoId({ each: true })
  warehouses?: string[];
}

export class UpdateInventoryDTO {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  sku?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  barcode?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  brand?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  model?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  color?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  weight?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  dimension?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsCurrency({ allow_decimal: true, require_symbol: false })
  price?: string;

  @IsOptional()
  @ArrayNotEmpty()
  @ArrayUnique((id) => id)
  @IsMongoId({ each: true })
  warehouses?: string[];

  @AtLeastOneFieldRequired([
    'name',
    'sku',
    'description',
    'barcode',
    'brand',
    'model',
    'color',
    'weight',
    'dimension',
    'price',
    'warehouses',
  ])
  dummyField = '';
}

class InventorySortDTO {
  @IsNotEmpty()
  @IsString()
  @IsEnum(InventorySortFieldsEnum)
  field: string;

  @IsNotEmpty()
  @IsEnum(SortOrderEnum)
  order: string;
}

export class InventoryGridDTO {
  @IsOptional()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => PaginationDTO)
  @IsInstance(PaginationDTO, { each: true })
  pagination?: PaginationDTO;

  @IsOptional()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => InventorySortDTO)
  @IsInstance(InventorySortDTO, { each: true })
  @IsArray()
  sorts?: InventorySortDTO[];

  @IsOptional()
  @IsString()
  searchTerms?: string;
}
