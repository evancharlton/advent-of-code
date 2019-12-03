const fs = require("fs");
const readline = require("readline");

const readLines = path => {
  return new Promise(resolve => {
    const lines = [];
    readline
      .createInterface({
        input: fs.createReadStream(path)
      })
      .on("line", line => {
        console.log(line);
        lines.push(line);
      })
      .on("close", () => {
        resolve(lines);
      });
  });
};

module.exports = readLines;
