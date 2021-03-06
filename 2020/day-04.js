const data = (type = "") => {
  return require("./input")(__filename, "\n\n", type).map((passport) =>
    passport
      .replace(/\n/g, " ")
      .split(" ")
      .reduce(
        (acc, entry) => {
          const [key, value] = entry.split(":");
          return { ...acc, [key]: value };
        },
        { cid: "North Pole" }
      )
  );
};

const REQUIRED = ["byr", "iyr", "eyr", "hgt", "hcl", "ecl", "pid", "cid"]; //.reduce((acc, field) => ({ ...acc, [field]: true }), {});

const EYE_COLORS = ["amb", "blu", "brn", "gry", "grn", "hzl", "oth"].reduce(
  (acc, v) => ({ ...acc, [v]: true }),
  {}
);

const isValid = ({
  byr = 0,
  iyr = 0,
  eyr = 0,
  hgt = "",
  hcl = "",
  ecl = "",
  pid = "",
}) => {
  if (!(+byr >= 1920 && +byr <= 2002)) {
    return false;
  }

  if (!(+iyr >= 2010 && +iyr <= 2020)) {
    return false;
  }

  if (!(+eyr >= 2020 && +eyr <= 2030)) {
    return false;
  }

  if (!hgt.match(/^[\d]+(?:cm|in)$/)) {
    return false;
  }

  if (hgt.endsWith("cm")) {
    const v = hgt.replace("cm", "");
    if (!(+v >= 150 && +v <= 193)) {
      return false;
    }
  }

  if (hgt.endsWith("in")) {
    const v = hgt.replace("in", "");
    if (!(+v >= 59 && +v <= 76)) {
      return false;
    }
  }

  if (!hcl.match(/^#[0-9a-f]{6}$/)) {
    return false;
  }

  if (!EYE_COLORS[ecl]) {
    return false;
  }

  if (!pid.match(/^[0-9]{9}$/)) {
    return false;
  }

  return true;
};

const part1 = (passports) => {
  return passports.filter((passport) => REQUIRED.every((key) => passport[key]))
    .length;
};

const part2 = (passports) => {
  return passports.filter(isValid).length;
};

/* istanbul ignore next */
if (process.argv.includes(__filename.replace(/\.[jt]s$/, ""))) {
  console.log(`Part 1:`, part1(data(process.argv[2] || "")));
  console.log(`Part 2:`, part2(data(process.argv[2] || "")));
}

module.exports = {
  data,
  part1,
  part2,
};
