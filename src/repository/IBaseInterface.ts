import {
    Model,
    CreationAttributes,
    FindOptions,
    WhereOptions,
    CreateOptions,
} from "sequelize";

export interface IBaseRepository<T extends Model> {
    create(data: CreationAttributes<T>, options?: CreateOptions): Promise<T>;

    findById(id: string | number): Promise<T | null>;

    findAll(options?: FindOptions<T>): Promise<T[]>;

    findOne(options: FindOptions<T>): Promise<T | null>;

    updateById(
  id: string | number,
  data: Partial<T>
): Promise<T | null>;

    update(
        where: WhereOptions<T>,
        data: Partial<T>
    ): Promise<number>;

    delete(id: string | number): Promise<number>;
}