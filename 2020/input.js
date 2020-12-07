const fs = require("fs");
const path = require("path");

module.exports = (day, delim = "\n", type = process.argv[2]) => {
  let filename = day;
  if (filename.endsWith(".js") || filename.endsWith(".ts")) {
    filename = filename
      .replace(__dirname, "")
      .replace(/^\//, "")
      .replace(".js", "")
      .replace(".ts", "");
  }

  filename = [filename, type, "txt"].filter(Boolean).join(".");

  const contents = new String(
    fs.readFileSync(path.resolve(path.join(__dirname, "input", filename)))
  );

  if (delim) {
    return contents.split(delim);
  }

  return contents;
};
