const {
  part1,
  part2,
  data,
} = require("./day-01");

describe("Day 01", () => {
  describe("Part 1", () => {
    it("works for simple data", () => {
      expect(part1([])).toBeUndefined();
    });

    it("works for test data", () => {
      expect(part1(data("test"))).toBeUndefined();
    });

    it("works for real data", () => {
      expect(part1(data())).toBeUndefined();
    });
  });

  describe("Part 2", () => {
    it("works for test data", () => {
      expect(part2(data("test"))).toBeUndefined();
    });

    it("works for real data", () => {
      expect(part2(data())).toBeUndefined();
    });
  });
});
