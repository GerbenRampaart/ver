import { fs, path, semver } from "./deps.ts";

export async function ensureVersion(
  root: string = Deno.cwd()
): Promise<semver.SemVer | null> {
  let parsedVersion: semver.SemVer | null = null;
  let maybeError: Error | null = null;

  try {
    await del(root);
    const output = await mostRecentGitTag();
    parsedVersion = semver.parse(output);

    if (!parsedVersion) {
      throw new Error(
        `Failed to parse version: ${output}. (which was the most recent git tag)`
      );
    }
  } catch (err) {
    maybeError = err;
  }

  await save(parsedVersion, root, maybeError);

  return await get(root);
}

export async function getVersion(
  root: string = Deno.cwd()
): Promise<semver.SemVer | null> {
  return await get(root);
}

const fileName = "ver.ts";

async function get(root: string): Promise<semver.SemVer | null> {
  try {
    const p = path.join(root, fileName);
    await Deno.stat(p);

    const v = await import(p);
    const keys = Object.keys(v);

    if (!keys.includes("default")) {
      throw new TypeError(`${fileName} does not include a default export`);
    }

    const val = v["default"];

    if (typeof val !== "string" && !(val instanceof String)) {
      throw new TypeError(
        `${fileName} default export did not contain a string value`
      );
    }

    return semver.parse(val.toString());
  } catch (err) {
    console.error(err);
    return null;
  }
}

async function save(
  version: semver.SemVer | null,
  root = Deno.cwd(),
  err: Error | null = null
): Promise<void> {
  const dest = path.join(root, fileName);

  const versionString = version
    ? `export default '${version.toString()}';`
    : '// "git tag" last line did not return a valid version';

  const datetimeString = `// Auto-generated from 'git tag' on ${new Date().toString()}.`;
  let errString = "";

  if (err) {
    errString = `// Error: ${err.message}`;
  }

  await Deno.writeTextFile(
    dest,
    `${datetimeString}
${errString}
${versionString}`
  );
}

export async function del(root = Deno.cwd()) {
  const dest = path.join(root, fileName);
  const exists = await Deno.stat(dest)
    .then(() => true)
    .catch(() => false);

  if (exists) {
    await Deno.remove(dest);
  }
}

const textDecoder = new TextDecoder();
export async function run(args: string[]): Promise<string> {
  const process = Deno.run({
    cmd: args,
    stdout: "piped",
    stdin: "piped",
    stderr: "piped",
  });

  const rawOutput = await process.output();
  const rawError = await process.stderrOutput();

  if (rawError && rawError.length > 0) {
    const err = textDecoder.decode(rawError);
    throw new Error(err);
  }
  //await process.status();
  return textDecoder.decode(rawOutput);
}

export async function mostRecentGitTag(): Promise<string> {
  const output = await run(["git", "tag"]);
  const nl = fs.detect(output) || fs.EOL.LF;
  const lines = output.split(nl);

  const versions = lines.map((l) => l.trim()).filter((l) => l.length > 0);

  if (versions.length === 0) {
    throw new Error("Could not find any git tags");
  }

  return versions[versions.length - 1];
}
