import { MongoSortOrderEnum } from '@repo/nest-basic-types';

export enum ItemEnum {
  INVENTORY = 'INVENTORY',
}

export type RepositoryWarehouseSort = {
  name?: MongoSortOrderEnum;
  createdAt?: MongoSortOrderEnum;
  updatedAt?: MongoSortOrderEnum;
};

export enum WarehouseSortFields {
  NAME = 'name',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
}
