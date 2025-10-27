import {
  FindOptionsRelationByString,
  FindOptionsRelations,
  FindOptionsWhere,
} from 'typeorm';

export type TypeOrmFindOptionsWhere<T> =
  | FindOptionsWhere<T>
  | FindOptionsWhere<T>[];

export type TypeOrmFindOptionsRelations<T> =
  | FindOptionsRelationByString
  | FindOptionsRelations<T>
  | undefined;
