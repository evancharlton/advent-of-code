const { part1, part2, data } = require("./day-04");

describe("Day 04", () => {
  describe("Part 1", () => {
    it("works for test data", () => {
      expect(part1(data("mixed"))).toBe(2);
      expect(part1(data("all-valid"))).toBe(0);
      expect(part1(data("all-invalid"))).toBe(4);
    });

    it("works for real data", () => {
      expect(part1(data())).toBe(245);
    });
  });

  describe("Part 2", () => {
    it("works for test data", () => {
      expect(part2(data("all-valid"))).toBe(0);
      expect(part2(data("all-invalid"))).toBe(0);
    });

    it("works for real data", () => {
      expect(part2(data())).toBe(133);
    });
  });
});
