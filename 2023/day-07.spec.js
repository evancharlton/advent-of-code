const { basename } = require("path");
const DAY = basename(__filename).replace(".spec.js", "");
const {
  part1,
  part2,
  data,
  compareCards,
  compareHands,
  parse,
  getType,
  CARDS,
} = require(`./${DAY}`);

describe(DAY.replace("-", " "), () => {
  test("getType", () => {
    expect(getType("23456")).toEqual("HIGH CARD");
    expect(getType("A23A4")).toEqual("ONE PAIR");
    expect(getType("23432")).toEqual("TWO PAIR");
    expect(getType("TTT98")).toEqual("THREE OF A KIND");
    expect(getType("23332")).toEqual("FULL HOUSE");
    expect(getType("AA8AA")).toEqual("FOUR OF A KIND");
    expect(getType("AAAAA")).toEqual("FIVE OF A KIND");
    expect(getType("QJJQ2")).toEqual("TWO PAIR");
    expect(getType("2345J", true)).toEqual("ONE PAIR");
    expect(getType("26J93", true)).toEqual("ONE PAIR");

    expect(getType("QQJQQ", true)).toEqual("FIVE OF A KIND");
    expect(getType("8JJJJ", true)).toEqual("FIVE OF A KIND");

    expect(getType("QJJQ2", true)).toEqual("FOUR OF A KIND");
    expect(getType("T55J5", true)).toEqual("FOUR OF A KIND");
    expect(getType("KTJJT", true)).toEqual("FOUR OF A KIND");
    expect(getType("QQQJA", true)).toEqual("FOUR OF A KIND");
    expect(getType("9JJ2J", true)).toEqual("FOUR OF A KIND");
    expect(getType("4446J", true)).toEqual("FOUR OF A KIND");

    expect(getType("TQ9JQ", true)).toEqual("THREE OF A KIND");
    expect(getType("J373A", true)).toEqual("THREE OF A KIND");
  });

  test("ranking", () => {
    expect(compareCards(CARDS)("77788", "778888")).toBeLessThan(0);

    expect(
      ["AAAAA", "AA8AA", "23332", "TTT98", "23432", "A23A4", "23456"]
        .map(parse)
        .sort(compareHands(CARDS))
        .map(({ cards }) => cards)
    ).toEqual(["23456", "A23A4", "23432", "TTT98", "23332", "AA8AA", "AAAAA"]);
  });

  test("Part 1", () => {
    const TEST_VALUE = 6440;
    const VALUE = 251287184;

    // test for test data
    expect(part1(data("test"))).toEqual(TEST_VALUE);

    // test for real data
    expect(part1(data())).toEqual(VALUE);
  });

  test("Part 2", () => {
    const TEST_VALUE = 5905;
    const VALUE = 250757288;

    // test for test data
    expect(part2(data("test", true))).toEqual(TEST_VALUE);

    // test for real data
    const two = part2(data("", true));
    expect(two).toBeGreaterThan(250731217);
    expect(two).toEqual(VALUE);
  });
});
