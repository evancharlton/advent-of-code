const { basename } = require("path");
const DAY = basename(__filename).replace(".spec.js", "");
const { part1, part2, data, parseHex, parseBits } = require(`./${DAY}`);

const TEST = "test data";
const PROD = "real data";

describe(DAY.replace("-", " "), () => {
  describe("parseHex", () => {
    test.skip("Literal packet", () => {
      expect(parseHex("D2FE28")).toEqual([
        {
          type: 4,
          value: 2021,
          version: 6,
        },
      ]);
    });

    test("Operator 0", () => {
      expect(
        parseBits("110100010100101001000100100".split("").map((b) => +b))
      ).toEqual([
        { version: 6, type: 4, value: 10 },
        { version: 2, type: 4, value: 20 },
      ]);
      expect(parseHex("38006F45291200").packets).toMatchObject([
        { version: 6, type: 4, value: 10 },
        { version: 2, type: 4, value: 20 },
        { version: 1, type: 6 },
      ]);
    });

    test("Operator 1", () => {
      expect(parseHex("EE00D40C823060").packets).toMatchObject([
        {
          type: 4,
          value: 1,
          version: 2,
        },
        {
          type: 4,
          value: 2,
          version: 4,
        },
        {
          type: 4,
          value: 3,
          version: 1,
        },
        { type: 3, version: 7 },
      ]);
    });
  });

  test.only("Part 1", () => {
    // test for test data
    expect(part1(data("test"))).toEqual(16);

    // test for real data
    expect(part1(data())).toEqual(920);
  });

  test.skip("Part 2", () => {
    // test for test data
    expect(part2(data("test"))).toEqual(TEST);

    // test for real data
    expect(part2(data())).toEqual(PROD);
  });
});
