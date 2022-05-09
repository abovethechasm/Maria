import { Application, oakCors } from "./deps/oak.ts";
import * as routes from "./routes/mod.ts";

const app = new Application();
app.use(oakCors())
Object.values(routes).forEach((route) => {
  app.use(route.routes());
  app.use(route.allowedMethods());
});

await app.listen({ port: 8000 });
