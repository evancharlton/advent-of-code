const { part1, part2, data, score, combat } = require("./day-22");

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
      expect(part2(data("test"))).toBe(291);
    });

    it("doesn't loop forever", () => {
      expect(part2(data("infinite"))).toBe(19);
    });

    it("works for real data", () => {
      expect(part2(data())).toBe(31835);
    });

    describe("combat", () => {
      it("works", () => {
        expect(combat([8], [10, 9, 7, 5])).toEqual([0, 116]);
        expect(combat([1, 8, 3], [4, 10, 9, 7, 5, 6, 2])).toEqual([0, 291]);
      });
    });
  });
});
