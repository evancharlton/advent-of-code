const {
  part1,
  part2,
  data,
  convertToBinary,
  apply,
  ZEROED_MEMORY,
} = require("./day-14");

describe("Day 14", () => {
  describe("Part 1", () => {
    it("works for test data", () => {
      expect(part1(data("test"))).toBe(165);
    });

    it.skip("works for real data", () => {
      expect(part1(data())).toBe(4938);
    });
  });

  describe("convertToBinary", () => {
    it("works", () => {
      expect(convertToBinary(11, 0)).toBe("1011");
      expect(convertToBinary(11, 6)).toBe("001011");
      expect(convertToBinary(0, ZEROED_MEMORY.length)).toMatch(ZEROED_MEMORY);
    });
  });

  describe("mask", () => {
    it("works", () => {
      expect(
        apply(
          undefined,
          "000000000000000000000000000000001011",
          "XXXXXXXXXXXXXXXXXXXXXXXXXXXXX1XXXX0X"
        )
      ).toMatch("000000000000000000000000000001001001");
    });
  });

  describe("Part 2", () => {
    it("works for test data", () => {
      expect(part2(data("test"))).toBe(undefined);
    });

    it.skip("works for real data", () => {
      expect(part2(data())).toBe(undefined);
    });
  });
});
