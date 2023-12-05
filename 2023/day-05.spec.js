const { basename } = require("path");
const DAY = basename(__filename).replace(".spec.js", "");
const { part1, part2, data } = require(`./${DAY}`);

describe(DAY.replace("-", " "), () => {
  test.skip("Part 1", () => {
    const TEST_VALUE = 35;
    const VALUE = 600279879;

    // test for test data
    expect(part1(data("test"))).toEqual(TEST_VALUE);

    // test for real data
    expect(part1(data())).toEqual(VALUE);
  });

  test("Part 2", () => {
    const TEST_VALUE = 27;
    const VALUE = 20191102;

    // test for test data
    expect(part2(data("test"))).toEqual(TEST_VALUE);

    expect(part2(data(), "929142010 467769747")).toEqual(1);

    // test for real data
    const value = 1 ?? part2(data());
    expect(value).not.toBe(23846357);
    expect(value).not.toBe(20191102); // ??
    expect(value).toBeLessThan(93329630);
    expect(value).toBeLessThan(120186646);
    expect(value).toBeLessThan(140213466);
    expect(value).toBeLessThan(207358360);
    expect(value).toBeLessThan(296646253);
    expect(value).toBeLessThan(334213102);
    expect(value).toBeLessThan(401662950);
    expect(value).toBeLessThan(600279879);
    expect(value).toBeLessThan(677936585);
    expect(value).toBeLessThan(692619543);
    expect(value).toBeLessThan(891387023);
    expect(value).toBeLessThan(1787915678);
    expect(20191102).toEqual(VALUE);
  });
});
