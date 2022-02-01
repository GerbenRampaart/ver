import { asserts } from "../deps.ts";
import { getVersion } from "../mod.ts";
import { deleteTestVer } from "./testHelpers.ts";

Deno.test(
  "Get Version (Fail)",
  {
    permissions: {
      read: true,
      write: true
    },
  },
  async (ctx: Deno.TestContext) => {
    await ctx.step("Delete Existing", async () => await deleteTestVer());
    await ctx.step("Get Undefined Version", async () => {
      const v = await getVersion();
      asserts.assert(v === null);
    });
    await ctx.step("Delete Existing", async () => await deleteTestVer());
  }
);
