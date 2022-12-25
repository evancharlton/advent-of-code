const { basename } = require("path");
const DAY = basename(__filename).replace(".spec.js", "");
const {
  getNumDigits,
  fromSnafu,
  toSnafu,
  part1,
  part2,
  data,
} = require(`./${DAY}`);

describe(DAY.replace("-", " "), () => {
  test("getNumDigits", () => {
    expect(getNumDigits(1)).toEqual(1);
    expect(getNumDigits(2)).toEqual(1);
    expect(getNumDigits(3)).toEqual(2);
    expect(getNumDigits(4)).toEqual(2);
    expect(getNumDigits(5)).toEqual(2);
    expect(getNumDigits(6)).toEqual(2);
    expect(getNumDigits(7)).toEqual(2);
    expect(getNumDigits(8)).toEqual(2);
    expect(getNumDigits(9)).toEqual(2);
    expect(getNumDigits(15)).toEqual(3);
    expect(getNumDigits(20)).toEqual(3);
    expect(getNumDigits(314159265)).toEqual(13);
  });

  test("toSnafu", () => {
    // 0 fives
    expect(toSnafu(198)).toEqual("2=0=");
    expect(toSnafu(1)).toEqual("1");
    expect(toSnafu(2)).toEqual("2");
    expect(toSnafu(3)).toEqual("1=");
    expect(toSnafu(4)).toEqual("1-");
    // 1 five
    expect(toSnafu(5)).toEqual("10");
    expect(toSnafu(6)).toEqual("11");
    expect(toSnafu(7)).toEqual("12");
    expect(toSnafu(8)).toEqual("2=");
    expect(toSnafu(9)).toEqual("2-");
    // 2 fives
    expect(toSnafu(10)).toEqual("20");
    // 3 fives
    expect(toSnafu(15)).toEqual("1=0");
    // 4 fives
    expect(toSnafu(20)).toEqual("1-0");
    // (2 * 5^3) + (-2 * 5^2) + (0 * 5^1) + (-1 * 5^0)
    expect(toSnafu(198)).toEqual("2=0=");
    // (1 * 5^5) + (-2 * 5^4) + (1 * 5^3) + (1 * 5^2) + (-1 * 5) + 2
    expect(toSnafu(2022)).toEqual("1=11-2");
    expect(toSnafu(4890)).toEqual("2=-1=0");
    expect(toSnafu(12345)).toEqual("1-0---0");
    expect(toSnafu(314159265)).toEqual("1121-1110-1=0");
  });

  test("fromSnafu", () => {
    expect(fromSnafu("22")).toEqual(12);
    expect(fromSnafu("222")).toEqual(62);
    expect(fromSnafu("1===")).toEqual(63);
    expect(fromSnafu("22222")).toEqual(1562);
    expect(fromSnafu("20")).toEqual(10);
    expect(fromSnafu("2=")).toEqual(8);
    expect(fromSnafu("2=-01")).toEqual(976);

    expect(fromSnafu("1")).toEqual(1);
    expect(fromSnafu("2")).toEqual(2);
    expect(fromSnafu("1=")).toEqual(3);
    expect(fromSnafu("1-")).toEqual(4);
    expect(fromSnafu("10")).toEqual(5);
    expect(fromSnafu("11")).toEqual(6);
    expect(fromSnafu("12")).toEqual(7);
    expect(fromSnafu("2=")).toEqual(8);
    expect(fromSnafu("2-")).toEqual(9);
    expect(fromSnafu("20")).toEqual(10);
    expect(fromSnafu("1=0")).toEqual(15);
    expect(fromSnafu("1-0")).toEqual(20);
    expect(fromSnafu("1=11-2")).toEqual(2022);
    expect(fromSnafu("1-0---0")).toEqual(12345);
    expect(fromSnafu("1121-1110-1=0")).toEqual(314159265);
  });

  test("Part 1", () => {
    const TEST_VALUE = "2=-1=0";
    const VALUE = "20-==01-2-=1-2---1-0";

    // test for test data
    expect(part1(data("test"))).toEqual(TEST_VALUE);

    // test for real data
    expect(part1(data())).toEqual(VALUE);
  });

  test("Part 2", () => {
    const TEST_VALUE = undefined;
    const VALUE = undefined;

    // test for test data
    expect(part2(data("test"))).toEqual(TEST_VALUE);

    // test for real data
    expect(part2(data())).toEqual(VALUE);
  });
});
