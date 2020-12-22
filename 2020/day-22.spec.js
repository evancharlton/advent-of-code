const { part1, part2, data, score } = require("./day-22");

describe("Day 22", () => {
  describe("score", () => {
    it("works", () => {
      expect(score([3, 2, 10, 6, 8, 5, 9, 4, 7, 1])).toBe(306);
    });
  });

  describe("Part 1", () => {
    it("works for test data", () => {
      expect(part1(data("test"))).toBe(306);
    });

    it("works for real data", () => {
      expect(part1(data())).toBe(33694);
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
