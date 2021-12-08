const { basename } = require("path");
const DAY = basename(__filename).replace(".spec.js", "");
const { part1, part2, data, reproduce, census } = require(`./${DAY}`);

const TEST = "test data";
const PROD = "real data";

describe(DAY.replace("-", " "), () => {
  test("Part 1", () => {
    // test for simple data
    // expect(part1([])).toEqual(undefined);

    // test for test data
    expect(part1(data("test"), 18)).toEqual(26);
    expect(part1(data("test"), 18)).toEqual(26);
    expect(part1(data("test"), 80)).toEqual(5934);

    // test for real data
    expect(part1(data())).toEqual(388739);
  });

  test("Part 2", () => {
    // test for simple data
    // expect(part2([])).toEqual(undefined);

    // test for test data
    expect(part2(data("test"), 256)).toEqual(26984457539);

    // test for real data
    expect(part2(data(), 256)).toEqual(1741362314973);
  });

  test("reproduce", () => {
    expect(reproduce(census([6, 0, 6, 4, 5, 6, 7, 8, 8]))).toEqual(
      census([5, 6, 5, 3, 4, 5, 6, 7, 7, 8])
    );
    expect(
      reproduce(
        census([
          0, 1, 0, 5, 6, 0, 1, 2, 2, 3, 0, 1, 2, 2, 2, 3, 3, 4, 4, 5, 7, 8,
        ])
      )
    ).toEqual(
      census([
        6, 0, 6, 4, 5, 6, 0, 1, 1, 2, 6, 0, 1, 1, 1, 2, 2, 3, 3, 4, 6, 7, 8, 8,
        8, 8,
      ])
    );
  });
});
