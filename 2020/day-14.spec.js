const {
  part1,
  part2,
  data,
  convertToBinary,
  apply,
  ZEROED_MEMORY,
  getOffsets,
} = require("./day-14");

describe("Day 14", () => {
  describe("Part 1", () => {
    it("works for test data", () => {
      expect(part1(data("test"))).toBe(165);
    });

    it("works for real data", () => {
      expect(part1(data())).toBe(2346881602152);
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
    describe("getOffsets", () => {
      it("works", () => {
        expect(getOffsets(42, "000000000000000000000000000000X1001X")).toEqual([
          26,
          27,
          58,
          59,
        ]);
      });
    });

    it("works for test data", () => {
      expect(part2(data("test2"))).toBe(208);
    });

    it("works for real data", () => {
      expect(part2(data())).toBe(3885232834169);
    });
  });
});
