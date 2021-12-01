const { part1, part2, data } = require("./day-01");

describe("Day 01", () => {
  describe("Part 1", () => {
    it.skip("works for simple data", () => {
      expect(part1([])).toEqual(undefined);
    });

    it("works for test data", () => {
      expect(part1(data("test"))).toEqual(7);
    });

    it("works for real data", () => {
      expect(part1(data())).toEqual(1390);
    });
  });

  describe("Part 2", () => {
    it("works for test data", () => {
      expect(part2(data("test"))).toEqual(undefined);
    });

    it("works for real data", () => {
      expect(part2(data())).toEqual(undefined);
    });
  });
});
