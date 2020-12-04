const fs = require("fs");
const path = require("path");

module.exports = (day, test) => {
  let filename = day;
  if (filename.endsWith(".js")) {
    filename = filename
      .replace(__dirname, "")
      .replace(/^\//, "")
      .replace(".js", test ? "test.txt" : ".txt");
  }
  return new String(
    fs.readFileSync(path.resolve(path.join(__dirname, "input", filename)))
  );
};
