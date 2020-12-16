const { part1, part2, data, merge, validTickets } = require("./day-16");

describe("Day 16", () => {
  describe("merge", () => {
    it("works", () => {
      expect(
        merge([
          [1, 5],
          [2, 6],
        ])
      ).toEqual(expect.arrayContaining([[1, 6]]));
    });
  });

  describe("Part 1", () => {
    it("works for test data", () => {
      expect(part1(data("test"))).toBe(71);
    });

    it("works for real data", () => {
      expect(part1(data())).toBe(28873);
    });
  });

  describe("Part 2", () => {
    it("works for test data", () => {
      expect(part2(data("test2"))).toBe(1);
    });

    it("works for real data", () => {
      expect(part2(data())).toBe(2587271823407);
    });
  });
});
