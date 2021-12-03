const { basename } = require("path");
const DAY = basename(__filename).replace(".spec.js", "");
const { part1, part2, data } = require(`./${DAY}`);

describe(DAY.replace("-", " "), () => {
  test("Part 1", () => {
    // test for simple data
    // expect(part1([])).toEqual(undefined);

    // test for test data
    expect(part1(data("test"))).toEqual(198);

    // test for real data
    expect(part1(data())).toEqual(3242606);
  });

  test("Part 2", () => {
    // test for simple data
    // expect(part1([])).toEqual(undefined);

    // test for test data
    expect(part2(data("test"))).toEqual(230);

    // test for real data
    expect(part2(data())).not.toEqual(3287470);
    expect(part2(data())).toEqual(4856080);
  });
});
