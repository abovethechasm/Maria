import { createID } from "./deps/auditor.ts";

interface User {
  name: string;
  id: string;
}

const data: User[] = [{
  name: "John Smith",
  id: createID(),
}, {
  name: "John Doe",
  id: createID(),
}, {
  name: "John Wick",
  id: createID(),
}, {
  name: "John Cena",
  id: createID(),
}];
console.log(data);
export default {
  find(id: string): User | undefined {
    return data.find((x) => x.id === id);
  },
  all() {
    return data;
  },
  add(name: string): boolean {
    const newUser = { name, id: createID() };
    console.log(newUser);
    data.push(newUser);
    return true;
  },
};
