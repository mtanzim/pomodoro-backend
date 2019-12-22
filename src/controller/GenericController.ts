import { getRepository } from "typeorm";

// https://stackoverflow.com/questions/41017287/cannot-use-new-with-expression-typescript
interface Constructable<T> {
  new (): T;
}

export class GenericController<Model, PostI, PatchI> {
  constructor(private _model: Constructable<Model>) {}

  async create(fields: PostI): Promise<Model> {
    const repo = getRepository(this._model);
    let newItem: Model = new this._model();
    Object.assign(newItem, fields);
    await repo.save(newItem);
    return newItem;
  }
  async getAll(): Promise<Model[]> {
    const repo = getRepository(this._model);
    let items = await repo.find();
    return items;
  }
  async get(id: number | string): Promise<Model> {
    const repo = getRepository(this._model);
    let item = await repo.findOne(id);
    if (item === undefined) {
      throw new Error("Item not found");
    }
    return item;
  }
  async delete(id: number | string): Promise<void> {
    const repo = getRepository(this._model);
    const item = await this.get(id);
    await repo.remove(item);
    return;
  }
  async update(id: number | string, fields: PatchI): Promise<Model> {
    const repo = getRepository(this._model);
    const item = await this.get(id);
    Object.assign(item, fields);
    await repo.save(item);
    return item;
  }
}
