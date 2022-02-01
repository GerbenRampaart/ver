import { path } from "../deps.ts";
import { run } from "../mod.ts";

export const testPath = path.join(Deno.cwd(), "tests");

export async function createTestVer(ver = "1.2.3"): Promise<void> {
  const p = path.join(testPath, "ver.ts");
  await Deno.writeTextFile(p, `export default '${ver}';`);
}

export async function deleteTestVer(): Promise<void> {
  const p = path.join(testPath, "ver.ts");
  const exists = await Deno.stat(p).then(() => true).catch(() => false);

  if (exists) {
    await Deno.remove(p);
  }
}

export async function addBogusGitTag(tag: string): Promise<void> {
  await run(["git", "tag", tag]);
}

export async function removeBogusGitTag(tag: string): Promise<void> {
  await run(["git", "tag", "-d", tag]);
}