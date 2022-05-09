import { helpers, Router } from "../deps/oak.ts";

import { baseAccountData, Manager } from "../manager.ts";

const router = new Router();
router
  .get("/u/:id", async (ctx) => {
    const params = helpers.getQuery(ctx, { mergeParams: true });
    const user = await Manager.findUser(params.id);
    ctx.response.body = user
      ? { status: 200, user: user }
      : { status: 404, user: {} };
  })
  .get("/users", async (ctx) => {
    const users = await Manager.allUser();
    ctx.response.body = { status: 200, users };
  })
  .post("/users/new", async (ctx) => {
    const params = ctx.request.body({ type: "json" });

    const data = await params.value;
    console.log(data)

    if (Object.keys(baseAccountData).every((x) => data[x])) {
      const success = await Manager.addUser(data);
      ctx.response.body = { status: success ? 200 : 500 };
    } else {
      ctx.response.body = {
        status: 400,
        message: "Missing Parameters (check whether email and password exist)",
      };
    }
  });

export default router;
