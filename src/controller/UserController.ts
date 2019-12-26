import { getRepository } from "typeorm";
import { User } from "../entity/User";
import bcrypt from "bcrypt";

export interface IUserBody {
  username: string;
  password: string;
  verifyPassword: string;
  name?: string;
  email?: string;
}
export interface IUserBodyPatch {
  name?: string;
  password: string;
  verifyPassword: string;
  email?: string;
}

export class UserController {
  constructor() {}

  private async _handlePassword(
    fields: IUserBody | IUserBodyPatch
  ): Promise<string> {
    const { password, verifyPassword } = fields;
    if (password === undefined || verifyPassword === undefined)
      throw new Error("Provide password!");
    if (password !== verifyPassword) throw new Error("Passwords don't match");
    const hashedPass = await bcrypt.hash(fields.password,8);
    return hashedPass;
  }

  async create(fields: IUserBody): Promise<User> {
    fields.password = await this._handlePassword(fields);
    const repo = getRepository(User);
    let newItem: User = new User();
    Object.assign(newItem, fields);
    const saved = await repo.save(newItem);
    return saved;
  }
  async get(id: number | string) {
    const repo = getRepository(User);
    let user = await repo.findOneOrFail({ where: { id } });
    return user;
  }
  async update(id: number | string, fields: IUserBodyPatch): Promise<User> {
    fields.password = await this._handlePassword(fields);
    const repo = getRepository(User);
    const item = await this.get(id);
    Object.assign(item, fields);
    const saved = await repo.save(item);
    return saved;
  }
}
