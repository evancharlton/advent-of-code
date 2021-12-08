const data = (type = "") => {
  return require("./input")(__filename, "\n", type);
};

const parse = (data) =>
  data.map((entry) => {
    const [signalPatterns, outputValue] = entry.split(" | ");
    return {
      patterns: signalPatterns.split(" "),
      outputs: outputValue.split(" "),
    };
  });

const part1 = (data) => {
  return parse(data).reduce((acc, { outputs }) => {
    return (
      outputs.filter(
        (display) =>
          display.length === 2 ||
          display.length === 3 ||
          display.length === 4 ||
          display.length === 7
      ).length + acc
    );
  }, 0);
};

const makeSet = () => new Set("abcdefg".split(""));

const union = (set, values) => {
  if (set.size === 0) {
    values.forEach((v) => set.add(v));
    return set;
  }
  return new Set(values.filter((v) => set.has(v)));
};

const eliminate = (set, values) => {
  const output = new Set([...set]);
  values.forEach((v) => {
    output.delete(v);
  });
  return output;
};

const segmentMapping = (signals) => {
  // prettier-ignore
  const segments = [
          makeSet(), // 0
      makeSet(),   makeSet(), // 1 2
           makeSet(), // 3
      makeSet(),   makeSet(), // 4 5
           makeSet(), // 6
  ];

  // 7
  signals
    .filter((signal) => signal.length === 3)
    .forEach((signal) => {
      const letters = signal.split("");
      segments[0] = union(segments[0], letters);
      segments[1] = eliminate(segments[1], letters);
      segments[2] = union(segments[2], letters);
      segments[3] = eliminate(segments[3], letters);
      segments[4] = eliminate(segments[4], letters);
      segments[5] = union(segments[5], letters);
      segments[6] = eliminate(segments[4], letters);
    });

  // 4
  signals
    .filter((signal) => signal.length === 4)
    .forEach((signal) => {
      const letters = signal.split("");
      segments[0] = eliminate(segments[0], letters);
      segments[1] = union(segments[1], letters);
      segments[2] = union(segments[2], letters);
      segments[3] = union(segments[3], letters);
      segments[4] = eliminate(segments[4], letters);
      segments[5] = union(segments[5], letters);
      segments[6] = eliminate(segments[6], letters);
    });

  // 1
  signals
    .filter((signal) => signal.length === 2)
    .forEach((signal) => {
      const letters = signal.split("");
      segments[0] = eliminate(segments[0], letters);
      segments[1] = eliminate(segments[1], letters);
      segments[2] = union(segments[2], letters);
      segments[3] = eliminate(segments[3], letters);
      segments[4] = eliminate(segments[4], letters);
      segments[5] = union(segments[5], letters);
      segments[6] = eliminate(segments[6], letters);
    });

  return segments;
};

const ALPHABET = {
  ["1110111"]: 0,
  ["0010010"]: 1,
  ["1011101"]: 2,
  ["1011011"]: 3,
  ["0111010"]: 4,
  ["1101011"]: 5,
  ["1101111"]: 6,
  ["1010010"]: 7,
  ["1111111"]: 8,
  ["1111011"]: 9,
};

const overlaps = (set, inputString) =>
  inputString.split("").some((letter) => set.has(letter));

const createAllMaps = (mapping) => {
  const arrays = mapping.map((m) => [...m]);
  let allCombinations = [""];
  arrays.forEach((array) => {
    const copy = allCombinations
      .map((map) => {
        return array.map((option) => {
          return map.concat(option);
        });
      })
      .flat();
    allCombinations = copy;
  });
  return allCombinations.filter((str) => {
    const set = new Set(str.split(""));
    return set.size === str.length;
  });
};

const findNumber = (mapString, pattern) => {
  switch (pattern.length) {
    case 2:
      return 1;
    case 3:
      return 7;
    case 4:
      return 4;
    case 7:
      return 8;
  }

  const key = mapString
    .split("")
    .map((segmentLetter) => pattern.includes(segmentLetter))
    .map((b) => (b ? "1" : "0"))
    .join("");
  return ALPHABET[key];
};

const part2 = (data) => {
  return parse(data)
    .map(({ patterns: inputPatterns, outputs }) => {
      const mapping = segmentMapping(inputPatterns);
      const mapStrings = createAllMaps(mapping);
      let correctMap = "";
      mapLoop: for (let i = 0; i < mapStrings.length; i += 1) {
        // Try and parse all of the input.
        inputLoop: for (let j = 0; j < inputPatterns.length; j += 1) {
          const number = findNumber(mapStrings[i], inputPatterns[j]);
          if (number === undefined) {
            continue mapLoop;
          }
        }
        correctMap = mapStrings[i];
      }
      if (correctMap) {
        return outputs.map((val) => findNumber(correctMap, val));
      }
    })
    .map((v) => +v.join(""))
    .reduce((acc, v) => acc + v, 0);
};

/* istanbul ignore next */
if (process.argv.includes(__filename.replace(/\.[jt]s$/, ""))) {
  console.log(`Part 1:`, part1(data(process.argv[2] || "")));
  console.log(`Part 2:`, part2(data(process.argv[2] || "")));
}

module.exports = {
  data,
  part1,
  part2,
  segmentMapping,
  findNumber,
  parse,
};
