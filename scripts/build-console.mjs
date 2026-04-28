import { cp, rm } from "node:fs/promises";
import { spawnSync } from "node:child_process";

function run(command, args) {
  const result = spawnSync(command, args, {
    stdio: "inherit"
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

const npm = process.platform === "win32" ? "npm.cmd" : "npm";

run(npm, ["--prefix", "apps/groomify-console", "install"]);
run(npm, ["--prefix", "apps/groomify-console", "run", "build"]);

await rm("dist", { force: true, recursive: true });
await cp("apps/groomify-console/dist", "dist", { recursive: true });
