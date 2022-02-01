import { asserts } from "../deps.ts";
import { ensureVersion } from "../mod.ts";
import { addBogusGitTag, deleteTestVer, removeBogusGitTag, testPath } from "./testHelpers.ts";

Deno.test(
  "Git Tag (Fail)",
  {
    permissions: {
      read: true,
      write: true
    },
    sanitizeResources: false
  },
  async (ctx: Deno.TestContext) => {
    const testTag = "bogus-tag";
    await ctx.step("Delete Existing", async () => await deleteTestVer());
    await ctx.step("Add Bogus Test Tag", async () => await addBogusGitTag(testTag));
    await ctx.step("Ensure Version", async () => {
      const v = await ensureVersion(testPath);
      asserts.assert(v === null);
    });
    await ctx.step("Remove Bogus Test Tag", async () => await removeBogusGitTag(testTag));
    await ctx.step("Delete Existing", async () => await deleteTestVer());
  }
);