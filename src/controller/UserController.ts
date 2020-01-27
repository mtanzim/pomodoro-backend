import { getRepository } from "typeorm";
import { User } from "../entity/User";
import * as jwt from "jsonwebtoken";

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

  async login({
    username,
    password
  }: {
    username: string;
    password: string;
  }): Promise<{ auth: boolean; token?: string }> {
    const repo = getRepository(User);
    const user = await repo.findOneOrFail({ where: { username } });
    const auth = await user.validatePassword(password);
    if (auth) {
      //sign JWT, valid for 1 hour
      const token = jwt.sign(
        { userId: user.id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      return { auth: true, token };
    }
    return { auth: false };
  }

  async create(fields: IUserBody): Promise<User> {
    const repo = getRepository(User);
    let newItem: User = new User();
    Object.assign(newItem, fields);
    await newItem.hashPassword();
    const saved = await repo.save(newItem);
    return saved;
  }
  async get(id: number | string) {
    const repo = getRepository(User);
    let user = await repo.findOneOrFail({ where: { id } });
    return user;
  }
  async update(id: number | string, fields: IUserBodyPatch): Promise<User> {
    const repo = getRepository(User);
    const item = await this.get(id);
    Object.assign(item, fields);
    await item.hashPassword();
    const saved = await repo.save(item);
    return saved;
  }
}
