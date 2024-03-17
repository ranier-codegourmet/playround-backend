import { MongoSortOrderEnum } from '@repo/nest-basic-types';

export type RepositoryInventorySort = {
  name?: MongoSortOrderEnum;
  createdAt?: MongoSortOrderEnum;
  updatedAt?: MongoSortOrderEnum;
};

export enum InventorySortFieldsEnum {
  NAME = 'name',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
}
