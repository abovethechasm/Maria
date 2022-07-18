import { createID } from "./deps/auditor.ts";
import { DB } from "./deps/sqlite.ts";

const db = new DB("userdata.sqlite");

interface UserData {
  first_name: string;
  last_name: string;
  user_id: number;
  user_email: string;
}

interface AccountData {
  user_email: string;
  user_password: string;
}

export const baseAccountData: AccountData = {
  user_email: "",
  user_password: "",
}

export const baseUserData: UserData = {
  first_name: "",
  last_name: "",
  user_id: 0,
  user_email: "",
};

class User {
  firstName: string;
  lastName: string;
  email: string;
  id: number;
  constructor(data: UserData) {
    this.firstName = data.first_name;
    this.lastName = data.last_name;
    this.email = data.user_email;
    this.id = data.user_id;
  }
}

export const Manager = {
  async findUser(id: string): Promise<User | undefined> {
    const item = await db.query("SELECT * FROM users WHERE user_id=?", [id]);
//    console.log(Object.assign(baseUserData, {user_id: item[0][0], user_email: item[0][2], user_password: item[0][1]}))
    if (item && item.length > 0) return new User(Object.assign(baseUserData, {user_id: item[0][0], user_email: item[0][2], user_password: item[0][1]}));
    return undefined;
  },
  async findPassWithEmail(email: string): Promise<string | undefined> {

    const item = await db.query("SELECT user_password FROM users WHERE user_email=?", [email]);
    console.log(item)

    if (item && item.length > 0) return item[0][1] as string;
    return undefined;
  },
  async findWithEmail(email: string): Promise<User | undefined> {
    console.log(email)
    const item = await db.query("SELECT * FROM users WHERE user_email=?", [email]);
    console.log(item)
//    console.log(Object.assign(baseUserData, {user_id: item[0][0], user_email: item[0][2], user_password: item[0][1]}))
    if (item && item.length > 0) return new User(Object.assign(baseUserData, {user_id: item[0][0], user_email: item[0][2], user_password: item[0][1]}));
    return undefined;
  },
  async allUser(): Promise<User[] | []> {
    const items = await db.query("SELECT * FROM users");
    if (items && items.length > 0) {
      return items.map((item) => new User(Object.assign(baseUserData, {user_id: item[0], user_email: item[2], user_password: item[1]})));
    }
    return [];
  },
  async addUser(data: AccountData): Promise<boolean> {
    console.log(data)
    const added = await db.query(`
    INSERT INTO users (
      user_email,
      user_password
    ) VALUES (
      '${data.user_email}', 
      '${data.user_password}'
    )
  `);
    console.log(added);
    return true;
  },
  async validateUser(email: string, password: string): Promise<number> {
    const item = await db.query("SELECT * FROM users WHERE email=?", [email]);
    if (item && item.length > 0) {
      const itemWithPassword = await db.query("SELECT * FROM users WHERE email=? AND password=?", [email, password]);
      if (itemWithPassword && itemWithPassword.length > 0) return 1; // User exists, do login
      return 2; // User exists, wrong pass
    };
    return 3; // User doesn't exist
  }
};
