const { basename } = require("path");
const DAY = basename(__filename).replace(".spec.js", "");
const { part1, part2, data, parseHex, parseBits } = require(`./${DAY}`);

const TEST = "test data";
const PROD = "real data";

describe(DAY.replace("-", " "), () => {
  describe("parseHex", () => {
    test("Literal packet", () => {
      expect(parseHex("D2FE28")).toEqual([
        {
          type: 4,
          value: 2021,
          version: 6,
        },
      ]);
    });

    test("Operator 0", () => {
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
    expect(part1("620080001611562C8802118E34")).toEqual(12);
    expect(part1("C0015000016115A2E0802F182340")).toEqual(23);
    expect(part1("A0016C880162017C3686B18A3D4780")).toEqual(31);

    // test for real data
    expect(part1(data())).toEqual(920);
  });

  test.only("Part 2", () => {
    // test for test data
    expect(part2("C200B40A82")).toEqual(3);
    expect(part2("04005AC33890")).toEqual(54);
    expect(part2("880086C3E88112")).toEqual(7);
    expect(part2("CE00C43D881120")).toEqual(9);
    expect(part2("D8005AC2A8F0")).toEqual(1);
    expect(part2("F600BC2D8F")).toEqual(0);
    expect(part2("9C005AC2F8F0")).toEqual(0);
    expect(part2("9C0141080250320F1802104A08")).toEqual(1);

    // test for real data
    expect(part2(data())).toEqual(10185143721112);
  });
});
