const { basename } = require("path");
const DAY = basename(__filename).replace(".spec.js", "");
const { part1, part2, data, pq } = require(`./${DAY}`);

const TEST = "test data";
const PROD = "real data";

describe(DAY.replace("-", " "), () => {
  test("pq", () => {
    const q = pq();
    q.put("foo", 10);
    q.put("bar", 5);
    q.put("baz", 30);
    q.put("extra", 20);
    expect(q.take()).toEqual("bar");
    expect(q.take()).toEqual("foo");
    expect(q.take()).toEqual("extra");
    expect(q.take()).toEqual("baz");
    expect(q.length()).toEqual(0);
  });

  test("Part 1", () => {
    // test for test data
    expect(part1(data("test"))).toEqual(40);

    // test for real data
    expect(part1(data())).toEqual(720);
  });

  test("Part 2", () => {
    // test for test data
    expect(part2(data("test"))).toEqual(315);

    // test for real data
    expect(part2(data())).toEqual(3025);
  });
});
