import { FindOptionsWhere } from 'typeorm';

export type TypeOrmFindOptionsWhere<T> =
  | FindOptionsWhere<T>
  | FindOptionsWhere<T>[];
