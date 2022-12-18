const { basename } = require("path");
const DAY = basename(__filename).replace(".spec.js", "");
const {
  bin,
  canBePushed,
  merge,
  part1,
  part2,
  data,
  canMerge,
} = require(`./${DAY}`);

describe(DAY.replace("-", " "), () => {
  test("Part 1", () => {
    const TEST_VALUE = 3068;
    const VALUE = 3065;

    // test for test data
    expect(part1(data("test"), 2022)).toEqual(TEST_VALUE);

    // test for real data
    expect(part1(data(), 2022)).toBeLessThan(3073);
    expect(part1(data(), 2022)).toEqual(VALUE);
  });

  test("Part 2", () => {
    const TEST_VALUE = undefined;
    const VALUE = undefined;

    // test for test data
    expect(part2(data("test"))).toEqual(TEST_VALUE);

    // test for real data
    expect(part2(data())).toEqual(VALUE);
  });

  test("merge +", () => {
    // prettier-ignore
    const board = [
      0b0000000,
      0b0000000,
      0b0000000,
      0b0011110
    ];

    // prettier-ignore
    const plus = [
      0b0010000,
      0b0111000,
      0b0010000
    ]

    expect(merge(board, plus, 0).map(bin)).toEqual(
      // prettier-ignore
      [
        0b0010000,
        0b0111000,
        0b0010000,
        0b0000000,
        0b0000000,
        0b0011110
      ].map(bin)
    );

    expect(merge(board, plus, 1).map(bin)).toEqual(
      // prettier-ignore
      [
        0b0010000,
        0b0111000,
        0b0010000,
        0b0000000,
        0b0011110
      ].map(bin)
    );

    expect(merge(board, plus, 2).map(bin)).toEqual(
      // prettier-ignore
      [
        0b0010000,
        0b0111000,
        0b0010000,
        0b0011110
      ].map(bin)
    );
  });

  test("merge", () => {
    expect(merge([0b01], [0b10], -1)).toEqual([0b10, 0b01]);
    expect(merge([], [0b0111100], -1).map(bin)).toEqual([0b0111100].map(bin));
    expect(merge([0b0000001], [0b0111100], 0).map(bin)).toEqual(
      [0b0111101].map(bin)
    );
    expect(
      merge(
        // prettier-ignore
        [
          0b0000001
        ],
        // prettier-ignore
        [
          0b0000001,
          0b0111100
        ],
        0
      ).map(bin)
    ).toEqual(
      // prettier-ignore
      [
        0b0000001,
        0b0111101
      ].map(bin)
    );

    // prettier-ignore
    const board = [
      0b1111110,
      0b1111100,
      0b1111000,
      0b1110000,
      0b1100000,
      0b1000000,
    ];

    // prettier-ignore
    const smallL = [
      0b0000001,
      0b0000011
    ];

    expect(merge(board, smallL, -1)).toEqual(
      // prettier-ignore
      [
        0b0000001,
        0b0000011,
        0b1111110,
        0b1111100,
        0b1111000,
        0b1110000,
        0b1100000,
        0b1000000,
      ]
    );

    // This is an illegal case, but let's check it anyway.
    expect(merge(board, smallL, 0).map(bin)).toEqual(
      // prettier-ignore
      [

        0b0000001,
        0b1111111,
        0b1111100,
        0b1111000,
        0b1110000,
        0b1100000,
        0b1000000,
      ].map(bin)
    );

    expect(merge(board, smallL, 1).map(bin)).toEqual(
      // prettier-ignore
      [
        0b1111111, // 0
        0b1111111, // 1
        0b1111000,
        0b1110000,
        0b1100000,
        0b1000000
      ].map(bin)
    );

    expect(merge(board, smallL, 3).map(bin)).toEqual(
      // prettier-ignore
      [
        0b1111110, // 0
        0b1111100, // 1
        0b1111001, // 2
        0b1110011, // 3
        0b1100000,
        0b1000000
      ].map(bin)
    );
  });

  test("canBePushed", () => {
    const bar = [0b0000001, 0b0000001];
    const board = [
      0b1111110, 0b1111100, 0b1111000, 0b1110000, 0b1100000, 0b1000000,
      0b0000000,
    ];
    expect(canBePushed("<", bar, board, 0)).toBe(false);
    expect(canBePushed("<", bar, board, 1)).toBe(false);
    expect(canBePushed("<", bar, board, 2)).toBe(true);
    expect(canBePushed("<", bar, board, 3)).toBe(true);

    expect(
      canBePushed(
        "<",
        [0b0000001, 0b0000001, 0b0000111],
        [0b0010000, 0b0111000, 0b0010000],
        0
      )
    ).toBe(true);
  });

  test("canMerge", () => {
    expect(canMerge([0b1010101], [0b0101010], 0)).toBe(true);
    expect(
      canMerge([0b100, 0b100, 0b100], [0b011, 0b011, 0b011, 0b011, 0b011], 2)
    ).toBe(true);

    expect(
      canMerge(
        [0b0000010, 0b0000010, 0b0001110],
        [0b0010000, 0b0111000, 0b0010000],
        0
      )
    ).toBe(true);

    expect(
      canMerge(
        [0b0000010, 0b0000010, 0b0001110],
        [0b0010000, 0b0111000, 0b0010000],
        1
      )
    ).toBe(false);
  });

  test("canMerge +", () => {
    // expect(canMerge([0b0100000, 0b1110000, 0b0100000], [0b0011110], 0)).toBe(
    //   true
    // );
    expect(canMerge([0b0100000, 0b1110000, 0b0100000], [0b0011110], 1)).toBe(
      false
    );
  });
});
