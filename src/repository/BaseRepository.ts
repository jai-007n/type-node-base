export class BaseRepository<T> {
  protected items: T[] = [];

  create(data: T): T {
    this.items.push(data);
    return data;
  }

  findAll(): T[] {
    return this.items;
  }

  clear(): void {
    this.items = [];
  }
}