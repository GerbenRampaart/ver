import { asserts } from "../deps.ts";
import { getVersion } from "../mod.ts";
import { deleteTestVer,createTestVer,testPath } from "./testHelpers.ts";

Deno.test(
  "Get Version (Success)",
  {
    permissions: {
      read: true,
      write: true,
    },
  },
  async (ctx: Deno.TestContext) => {
    await ctx.step("Delete Existing", async () => await deleteTestVer());
    await ctx.step("Create New", async () => await createTestVer());
    await ctx.step("Get Defined Version", async () => {
      const v = await getVersion(testPath);

      asserts.assert(v !== null);
      asserts.assert(v.major === 1);
      asserts.assert(v.minor === 2);
      asserts.assert(v.patch === 3);
    });

    await ctx.step("Delete Existing", async () => await deleteTestVer());
  }
);
