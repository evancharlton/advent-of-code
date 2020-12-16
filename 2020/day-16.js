const data = (type = "") => {
  const [infoBlock, yoursBlock, nearbyBlock] = require("./input")(
    __filename,
    "\n\n",
    type
  );

  const yours = yoursBlock.split("\n")[1].split(",").map(Number);

  const nearby = nearbyBlock
    .split("\n")
    .slice(1)
    .map((line) => line.split(",").map(Number));

  const info = infoBlock.split("\n").map((line) => {
    const name = line.replace(/:.+$/, "");
    const ranges = line
      .replace(/.+: /, "")
      .split(" or ")
      .map((range) => {
        return range.split("-").map(Number);
      });
    return { name, ranges };
  });

  return {
    info,
    yours,
    nearby,
  };
};

function merge(arr) {
  // copy and sort the array
  var result = arr.slice().sort(function (a, b) {
    return a[0] - b[0] || a[1] - b[1];
  });
  let i = 0;

  while (i < result.length - 1) {
    var current = result[i],
      next = result[i + 1];

    // check if there is an overlapping
    if (current[1] >= next[0]) {
      current[1] = Math.max(current[1], next[1]);
      // remove next
      result.splice(i + 1, 1);
    } else {
      // move to next
      i++;
    }
  }
  return result;
}

const part1 = ({ info, nearby }) => {
  const ranges = merge(
    info
      .map(({ ranges }) => ranges)
      .flat()
      .sort((a, b) => a[0] - b[0] || a[1] - b[1])
  );

  return nearby
    .map((line) =>
      line
        .filter((field) => {
          for (let i = 0; i < ranges.length; i += 1) {
            const [bottom, top] = ranges[i];
            if (field >= bottom && field <= top) {
              return false;
            }
          }
          return true;
        })
        .filter(Boolean)
    )
    .flat()
    .reduce((acc, v) => acc + v, 0);
};

const validTickets = ({ info, nearby }) => {
  const ranges = info
    .map(({ ranges }) => ranges)
    .flat()
    .sort((a, b) => a[0] - b[0] || a[1] - b[1]);

  return nearby.filter((fields) => {
    return fields.every((field) => {
      for (let i = 0; i < ranges.length; i += 1) {
        const [a, b] = ranges[i];
        const isValid = field >= a && field <= b;
        if (isValid) {
          return true;
        }
      }
      return false;
    });
  });
};

const getFieldValues = (allTickets) => {
  return allTickets
    .reduce((acc, ticket) => {
      if (acc.length === 0) {
        return ticket.map((field) => [field]);
      }
      for (let i = 0; i < ticket.length; i += 1) {
        acc[i].push(ticket[i]);
      }
      return acc;
    }, [])
    .map((fields) => fields.sort((a, b) => +a - +b));
};

const computeUnion = ({ infoMap, allTickets }) => {
  const infoEntries = Object.entries(infoMap);
  const fieldValues = getFieldValues(allTickets);
  const possibilities = [];

  for (let i = 0; i < fieldValues.length; i += 1) {
    const values = fieldValues[i];
    const options = infoEntries.filter(([_, [[a, b], [c, d]]]) => {
      const allMatch = values.every((val) => {
        return (val >= a && val <= b) || (val >= c && val <= d);
      });
      return allMatch;
    });
    possibilities[i] = options.map(([key]) => key);
  }
  return possibilities;
};

const part2 = ({ info, nearby, yours }) => {
  if (!yours) {
    return undefined;
  }

  const infoMap = info.reduce(
    (acc, { name, ranges }) => ({
      ...acc,
      [name]: ranges,
    }),
    {}
  );

  const allTickets = validTickets({ nearby, info });
  // Insert my ticket in there, too!
  allTickets.unshift(yours);

  const result = computeUnion({ infoMap, allTickets });
  const locations = {};
  result.forEach((options, i) => {
    options.forEach((option) => {
      locations[option] = locations[option] || [];
      locations[option].push(i);
    });
  });

  while (Object.values(locations).some((loc) => loc.length > 1)) {
    Object.entries(locations).forEach(([name, locs]) => {
      if (locs.length === 1) {
        // Great, this is known.
        const [position] = locs;
        result[position] = name;
        Object.entries(locations)
          .filter(([name2]) => name2 !== name)
          .forEach(([name2, locs2]) => {
            locations[name2] = locs2.filter((v) => v !== position);
          });
      }
    });
  }

  const deps = Object.entries(locations)
    .filter(([name]) => name.startsWith("departure"))
    .map(([_, v]) => v)
    .flat()
    .map((i) => yours[i])
    .reduce((acc, v) => acc * v, 1);

  return deps;
};

if (process.argv.includes(__filename.replace(/\.[jt]s$/, ""))) {
  console.log(`Part 1:`, part1(data()));
  console.log(`Part 2:`, part2(data()));
}

module.exports = {
  data,
  part1,
  part2,
  merge,
  validTickets,
};
