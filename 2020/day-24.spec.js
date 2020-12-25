const {
  DELTAS,
  part1,
  part2,
  data,
  getSteps,
  getId,
  getNeighbors,
} = require("./day-24");

describe("Day 24", () => {
  describe("getSteps", () => {
    it("works", () => {
      expect(getSteps("esew")).toEqual(["e", "se", "w"]);
      expect(getSteps("nwwswee")).toEqual(["nw", "w", "sw", "e", "e"]);
    });
  });

  describe("getId", () => {
    it("works", () => {
      expect(getId(getSteps("nwwswee"))).toEqual("0,0,0");
    });
  });

  describe("getNeighbors", () => {
    it("works", () => {
      expect(getNeighbors("0,0,0")).toEqual(
        expect.arrayContaining([
          "0,1,-1", // nw
          "-1,1,0", // w
          "-1,0,1", // sw
          "0,-1,1", // se
          "1,-1,0", // e
          "1,0,-1", // ne
        ])
      );
    });
  });

  describe("Part 1", () => {
    it("works for simple data", () => {
      expect(
        part1([
          // two step
          getSteps("ee"),
        ])
      ).toBe(1);
      expect(
        part1([
          // one step
          ["e"],
          // one step back to that same tile
          ["e"],
        ])
      ).toBe(0);
    });

    it("works for test data", () => {
      const testData = data("test");
      expect(part1(testData.slice(0, 1))).toBe(1);
      expect(part1(testData.slice(0, 2))).toBe(2);
      expect(part1(testData)).toBe(10);
    });

    it("works for real data", () => {
      expect(part1(data())).toBe(549);
    });
  });

  describe("Part 2", () => {
    it("works for test data", () => {
      expect(part2(data("test"), 1)).toBe(15);
      expect(part2(data("test"), 2)).toBe(12);
      expect(part2(data("test"), 3)).toBe(25);
      expect(part2(data("test"), 4)).toBe(14);
      expect(part2(data("test"), 10)).toBe(37);
      expect(part2(data("test"), 20)).toBe(132);
      expect(part2(data("test"), 30)).toBe(259);
      expect(part2(data("test"), 40)).toBe(406);
      expect(part2(data("test"), 50)).toBe(566);
      expect(part2(data("test"), 100)).toBe(2208);
    });

    it("works for real data", () => {
      expect(part2(data())).toBeGreaterThan(456);
    });
  });
});
