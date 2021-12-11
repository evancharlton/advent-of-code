const { basename } = require("path");
const DAY = basename(__filename).replace(".spec.js", "");
const {
  part1,
  part2,
  data,
  tick,
  createBoard,
  parse,
  printBoard,
} = require(`./${DAY}`);

const TEST = "test data";
const PROD = "real data";

describe(DAY.replace("-", " "), () => {
  test("tick", () => {
    const { next, flashes } = tick(
      createBoard(
        parse(
          `
11111
19991
19191
19991
11111
    `
            .trim()
            .split("\n")
        )
      )
    );
    expect(printBoard(next)).toEqual(
      `
34543
40004
50005
40004
34543
`.trim()
    );

    expect(flashes).toEqual(9);
  });

  test("Missing flash", () => {
    const { next, flashes } = tick(createBoard(parse(data("test-step-2"))));
    console.log(printBoard(next));
    expect(flashes).toEqual(45);
  });

  test("steps", () => {
    const board = createBoard(parse(data("test")));
    let current = board;

    let totalFlashes = 0;
    for (let i = 0; i < 100; i += 1) {
      const { next, flashes } = tick(current);
      const step = i + 1;
      totalFlashes += flashes;
      if (STAGES[step]) {
        try {
          expect(printBoard(next)).toEqual(STAGES[step].trim());
        } catch (ex) {
          console.log(`Failed from ${i} -> ${step}`);
          console.log(`At step ${i}:\n${printBoard(current)}`);
          console.log(`After step ${step}:\n${printBoard(next)}`);
          throw ex;
        }
      }
      current = next;
    }
  });

  test("Part 1", () => {
    // test for simple data
    // expect(part1([])).toEqual(undefined);

    // test for test data
    expect(part1(data("test"), 1)).toEqual(0);
    expect(part1(data("test"), 2)).toEqual(35);
    expect(part1(data("test-step-2"), 1)).toEqual(45);
    expect(part1(data("test"), 3)).toEqual(35 + 45);
    expect(part1(data("test"), 10)).toEqual(204);

    expect(part1(data("test"))).toEqual(1656);

    // test for real data
    expect(part1(data())).toEqual(1599);
  });

  test("Part 2", () => {
    // test for simple data
    // expect(part2([])).toEqual(undefined);

    // test for test data
    expect(part2(data("test"))).toEqual(195);

    // test for real data
    expect(part2(data())).toEqual(418);
  });
});

const STAGES = {
  [1]: `
6594254334
3856965822
6375667284
7252447257
7468496589
5278635756
3287952832
7993992245
5957959665
6394862637`,
  [2]: `
8807476555
5089087054
8597889608
8485769600
8700908800
6600088989
6800005943
0000007456
9000000876
8700006848`,
  [10]: `
0481112976
0031112009
0041112504
0081111406
0099111306
0093511233
0442361130
5532252350
0532250600
0032240000`,
  [20]: `
3936556452
5686556806
4496555690
4448655580
4456865570
5680086577
7000009896
0000000344
6000000364
4600009543`,
  [30]: `
0643334118
4253334611
3374333458
2225333337
2229333338
2276733333
2754574565
5544458511
9444447111
7944446119`,
  [40]: `
6211111981
0421111119
0042111115
0003111115
0003111116
0065611111
0532351111
3322234597
2222222976
2222222762`,
  [50]: `
9655556447
4865556805
4486555690
4458655580
4574865570
5700086566
6000009887
8000000533
6800000633
5680000538`,
  [100]: `
0397666866
0749766918
0053976933
0004297822
0004229892
0053222877
0532222966
9322228966
7922286866
6789998766`,
};
