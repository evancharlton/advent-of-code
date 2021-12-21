const { basename } = require("path");
const DAY = basename(__filename).replace(".spec.js", "");
const { part1, part2, data } = require(`./${DAY}`);

const TEST = "test data";
const PROD = "real data";

describe(DAY.replace("-", " "), () => {
  test("Part 1", () => {
    // test for test data
    expect(part1(data("test"))).toEqual(739785);

    // test for real data
    expect(part1(data())).not.toEqual(1126362);
  });

  test("Part 2", () => {
    // test for test data
    expect(part2(data("test"))).toEqual(444356092776315);

    // test for real data
    expect(part2(data())).toEqual(133029050096658);
  });
});
