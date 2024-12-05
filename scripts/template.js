const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const now = new Date();

const [date, year] = (() => {
  const d =
    process.argv[2] === "today"
      ? now.getDate()
      : process.argv[2] === undefined
      ? now.getDate() + 1
      : process.argv[2];

  const date = `0${d}`.substr(-2);
  const year = process.argv[3] ?? String(now.getFullYear());
  return [date, year];
})();

const yearDir = path.resolve(path.join(__dirname, "..", year));

fs.copyFileSync(
  path.join(yearDir, "template"),
  path.join(yearDir, `day-${date}.js`)
);

fs.copyFileSync(
  path.join(yearDir, "template.spec"),
  path.join(yearDir, `day-${date}.spec.js`)
);

fs.writeFileSync(path.join(yearDir, "input", `day-${date}.txt`), "");
fs.writeFileSync(path.join(yearDir, "input", `day-${date}.test.txt`), "");

execSync(`git add ${yearDir}/day-${date}.*`);
