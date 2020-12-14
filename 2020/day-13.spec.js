const { part1, part2, data } = require("./day-13");

describe("Day 13", () => {
  describe("Part 1", () => {
    it("works for test data", () => {
      expect(part1(data("test"))).toBe(295);
    });

    it("works for real data", () => {
      expect(part1(data())).toBe(4938);
    });
  });

  describe("Part 2", () => {
    const simplePart2 = (schedules) => part2({ schedules });

    it("works for test data", () => {
      expect(simplePart2("17,x,13,19")).toBe(3417);
      expect(simplePart2("67,7,59,61")).toBe(754018);
      expect(simplePart2("67,x,7,59,61")).toBe(779210);
      expect(simplePart2("67,7,x,59,61")).toBe(1261476);
      expect(simplePart2("1789,37,47,1889")).toBe(1202161486);
    });

    it("works for real data", () => {
      expect(part2(data())).toBe(230903629977901);
    });
  });
});
