import { Model, ModelStatic, FindOptions, CreateOptions, CreationAttributes, WhereOptions } from "sequelize";
import { IBaseRepository } from "./IBaseInterface";

export class BaseRepository<T extends Model> implements IBaseRepository<T> {
  protected model: ModelStatic<T>;

  constructor(model: ModelStatic<T>) {
    this.model = model;
  }

  async findAll(options?: FindOptions): Promise<T[]> {
    return this.model.findAll(options);
  }

  async findById(id: string | number): Promise<T | null> {
    return this.model.findByPk(id);
  }

  async findOne(options?: FindOptions): Promise<T | null> {
    return this.model.findOne(options);
  }

  async create(data: CreationAttributes<T>, options?: CreateOptions): Promise<T> {
    return this.model.create(data as any, options);
  }

  async updateById(
    id: string | number,
    data: Partial<T>
  ): Promise<T | null> {
    const [affected] = await this.model.update(data as any, {
      where: { id } as any,
    });

    if (!affected) return null;

    return this.model.findByPk(id);
  }

  async update(
    where: WhereOptions<T>,
    data: Partial<T>
  ): Promise<number> {
    const [affectedRows] = await this.model.update(data as any, {
      where,
    });

    return affectedRows;
  }

  async delete(id: string | number): Promise<number> {
    return this.model.destroy({
      where: { id } as any,
    });
  }
}