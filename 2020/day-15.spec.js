const { part1, part2, data } = require("./day-15");

describe("Day 15", () => {
  describe("Part 1", () => {
    it("works for test data", () => {
      // expect(part1([0], 1)).toBe(0);
      // expect(part1([0, 3], 2)).toBe(3);
      // expect(part1([0, 3, 6], 3)).toBe(6);
      // expect(part1([0, 3, 6], 4)).toBe(0);
      // expect(part1([0, 3, 6], 5)).toBe(3);
      // expect(part1([0, 3, 6], 6)).toBe(3);
      expect(part1([0, 3, 6], 7)).toBe(1);
      expect(part1([0, 3, 6], 8)).toBe(0);
      expect(part1([0, 3, 6], 9)).toBe(4);
      expect(part1([0, 3, 6], 10)).toBe(0);
      expect(part1([0, 3, 6])).toBe(436);
    });

    it.skip("works for real data", () => {
      expect(part1(data())).toBe(undefined);
    });
  });

  describe("Part 2", () => {
    it("works for test data", () => {
      // expect(part2(data("test"))).toBe(undefined);
    });

    it.skip("works for real data", () => {
      expect(part2(data())).toBe(undefined);
    });
  });
});
