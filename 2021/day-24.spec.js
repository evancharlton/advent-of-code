const { basename } = require("path");
const DAY = basename(__filename).replace(".spec.js", "");
const { part1, part2, data, alu } = require(`./${DAY}`);

const TEST = "test data";
const PROD = "real data";

describe(DAY.replace("-", " "), () => {
  test("alu", () => {
    for (const inp of ["98491959997994"]) {
      const input = inp.split("").map((v) => +v);
      expect(alu(data("debug"), input)).toMatchObject(alu(data(), input));
    }
  });
  test.skip("Part 1", () => {
    // test for test data
    expect(alu(data("neg"), [10]).x).toEqual(-10);

    // test for real data
    // This was found with a strange combination of brute-forcing and math.
    // I'm not proud.
    expect(part1(data()).z).toEqual(98491959997994);
  });

  test.skip("Part 2", () => {
    // test for test data
    expect(part2(data("test"))).toEqual(TEST);

    // test for real data
    expect(part2(data())).toEqual(PROD);
  });
});
