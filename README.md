# ver
This module generates a ver.ts with as version from the latest git tag for you to use in code.

## What?
In node.js there is een idiomatic way of storing the version of whichever program you're building which is the package.json.

In Deno the versions are managed by git tags, which is better, because you manage the version of your software in a more abstract way: using git, and not npm. npm is more locked-in to a technology. (git is also a technology but if you're not using that then I don't know what to say).

This presents a problem though:

The .git directory (where the tags are stored) is not available in production code (or at least shouldn't be) but it's a pretty common approach in node.js to parse the package.json and use the version found there to display in your app. For example, an api could return it's version in a header, and a cli wants to display the version in it's --help.

There is a Deno module that solves this problem with a rich feature set, including a cli which does the git tagging. Check it out here: https://deno.land/x/version_ts

While the above solution is excellent, I wanted a super simple version of this. Not requiring a cli to be installed but just generating a single .ts file for you to use based on the latest git tag.

## How?

In the startup of your app, put 
```typescript
await ensureVersion();
```
This will generate a ver.ts file in the cwd of your project. ensureVersion will make just that file always contains the latest version from your git tag list.

Whenever you need the current version, you can import the ver.ts or use 
```typescript
await getVersion();
```
anywhere in your application to get the sematic version.

Note that using getVersion is better because it lazy loads (with await import) the ver.ts