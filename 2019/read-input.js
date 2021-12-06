const fs = require("fs");
const readline = require("readline");

const readLines = (path, input) => {
  if (input) {
    if (Array.isArray(input)) {
      return Promise.resolve(input);
    }
    return Promise.resolve([input]);
  }
  return new Promise((resolve) => {
    const lines = [];
    readline
      .createInterface({
        input: fs.createReadStream(path),
      })
      .on("line", (line) => {
        if (line.startsWith("//")) {
          return;
        }

        if (line.trim().length === 0) {
          return;
        }

        lines.push(line);
      })
      .on("close", () => {
        resolve(lines);
      });
  });
};

module.exports = readLines;
