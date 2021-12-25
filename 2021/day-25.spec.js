const { basename } = require("path");
const DAY = basename(__filename).replace(".spec.js", "");
const { part1, part2, data, step, print } = require(`./${DAY}`);

const TEST = "test data";
const PROD = "real data";

describe(DAY.replace("-", " "), () => {
  test("step", () => {
    const s = (file) => {
      const [map, moved] = step(data(file));
      return [print(map), moved];
    };
    expect(s("east")).toEqual(["...>>>>.>..", 1]);
    expect(s("block")).toEqual([
      `
..........
.>........
..v....v>.
..........
    `.trim(),
      3,
    ]);

    expect(s("wrap")).toEqual([
      `
..vv>..
.......
>......
v.....>
>......
.......
....v..
      `.trim(),
      5,
    ]);
  });

  test("Part 1", () => {
    // test for test data
    expect(part1(data("test"))).toEqual(58);

    // test for real data
    expect(part1(data())).toEqual(351);
  });

  test.skip("Part 2", () => {
    // test for test data
    expect(part2(data("test"))).toEqual(TEST);

    // test for real data
    expect(part2(data())).toEqual(PROD);
  });
});
