const { basename } = require("path");
const DAY = basename(__filename).replace(".spec.js", "");
const { part1, part2, data, generator } = require(`./${DAY}`);

describe(DAY.replace("-", " "), () => {
  test("generator", () => {
    const gen = generator(123);
    expect(gen()).toEqual(15887950)
    expect(gen()).toEqual(16495136)
    expect(gen()).toEqual(527345)
    expect(gen()).toEqual(704524)
    expect(gen()).toEqual(1553684)
    expect(gen()).toEqual(12683156)
    expect(gen()).toEqual(11100544)
    expect(gen()).toEqual(12249484)
    expect(gen()).toEqual(7753432)
    expect(gen()).toEqual(5908254)
  })

  test("Part 1", () => {
    const TEST_VALUE = 37327623;
    const VALUE = 13753970725;

    // test for test data
    expect(part1(data("test"))).toEqual(TEST_VALUE);

    // test for real data
    expect(part1(data())).toEqual(VALUE);
  });

  test("Part 2", () => {
    const VALUE = 1570;

    expect(part2([123], 10)).toEqual(6);

    // test for test data
    expect(part2([1, 2, 3, 2024])).toEqual(23);

    // test for real data
    expect(part2(data())).toEqual(VALUE);
  });
});
