export * from './dto';

export type BasicApiResponse<T> = {
  data: T;
};

export enum SortOrderEnum {
  ASC = 'asc',
  DESC = 'desc',
}

export enum MongoSortOrderEnum {
  ASC = 1,
  DESC = -1,
}
