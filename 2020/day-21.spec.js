const { part1, part2, data } = require("./day-21");

describe("Day 21", () => {
  describe("Part 1", () => {
    it("works for test data", () => {
      expect(part1(data("test"))).toBe(5);
    });

    it("works for real data", () => {
      expect(part1(data())).toBe(2436);
    });
  });

  describe("Part 2", () => {
    it("works for test data", () => {
      expect(part2(data("test"))).toBe("mxmxvkd,sqjhc,fvjkl");
    });

    it("works for real data", () => {
      expect(part2(data())).toBe(
        "dhfng,pgblcd,xhkdc,ghlzj,dstct,nqbnmzx,ntggc,znrzgs"
      );
    });
  });
});
