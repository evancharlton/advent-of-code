const fs = require("fs");
const path = require("path");

const now = new Date();

const date = `0${process.argv[2] ?? now.getDate() + 1}`.substr(-2);
const year = process.argv[3] ?? String(now.getFullYear());

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
