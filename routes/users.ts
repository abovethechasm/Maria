import { helpers, Router } from "../deps/oak.ts";

import manager from "../manager.ts"

const router = new Router();
router
  .get("/u/:id", (ctx) => {
    const params = helpers.getQuery(ctx, { mergeParams: true });
    const user = manager.find(params.id)
    ctx.response.body = user ? {status: 200, user: user} : {status: 404, user: {}};
  })
  .get("/users", (ctx) => {
    const users = manager.all()
    ctx.response.body = {status: 200, users};
  })
  .get("/users/new", (ctx) => {
    const params = helpers.getQuery(ctx, { mergeParams: true });
    if(params.name) {
      const success = manager.add(params.name)
      ctx.response.body = {status: success ? 200 : 500};  
    }
    else ctx.response.body = {status: 400, message: "name parameter required!"}
  });


  export default router;