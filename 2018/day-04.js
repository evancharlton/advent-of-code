const data = (type = "") => {
  return require("./input")(__filename, "\n", type).sort();
};

const part1 = (entries) => {
  const guardRecords = new Map();
  let currentGuardId = undefined;
  let naptimeStart = 0;
  entries.forEach((entry) => {
    const [_, year, month, day, hour, minute] = entry
      .match(/^\[([\d]+)-([\d]+)-([\d]+ ([\d]+):([\d]+))] /)
      .map(Number);

    if (entry.endsWith("begins shift")) {
      const [_, id] = entry.match(/Guard #([\d]+) /).map(Number);
      currentGuardId = id;
      naptimeStart = 0;
      if (!guardRecords.has(id)) {
        guardRecords.set(id, new Uint16Array(60));
      }
    } else if (entry.endsWith("falls asleep")) {
      naptimeStart = minute;
    } else if (entry.endsWith("wakes up")) {
      const minutes = guardRecords.get(currentGuardId);
      for (let i = naptimeStart; i < minute; i += 1) {
        minutes[i] += 1;
      }
    }
  });

  let snoozerId = undefined;
  let snoozeTime = 0;
  guardRecords.forEach((minutes, guardId) => {
    const sum = minutes.reduce((acc, c) => acc + c, 0);
    if (sum > snoozeTime) {
      snoozeTime = sum;
      snoozerId = guardId;
    }
  });

  const [{ minute: snooziestMinute }] = guardRecords
    .get(snoozerId)
    .reduce((acc, v, i) => [...acc, { minute: i, total: v }], [])
    .sort(({ total: a }, { total: b }) => b - a);

  return snoozerId * snooziestMinute;
};

const part2 = (entries) => {
  const minutes = new Array(60);
  let currentGuardId = undefined;
  let naptimeStart = 0;
  entries.forEach((entry) => {
    const [_, year, month, day, hour, minute] = entry
      .match(/^\[([\d]+)-([\d]+)-([\d]+ ([\d]+):([\d]+))] /)
      .map(Number);

    if (entry.endsWith("begins shift")) {
      const [_, id] = entry.match(/Guard #([\d]+) /).map(Number);
      currentGuardId = id;
      naptimeStart = 0;
    } else if (entry.endsWith("falls asleep")) {
      naptimeStart = minute;
    } else if (entry.endsWith("wakes up")) {
      for (let i = naptimeStart; i < minute; i += 1) {
        if (!minutes[i]) {
          minutes[i] = [];
        }
        minutes[i].push(currentGuardId);
      }
    }
  });

  const maxAsleep = (ids) => {
    const counts = new Map();
    ids.forEach((id) => {
      counts.set(id, (counts.get(id) || 0) + 1);
    });

    // Find the highest number
    let max = 0;
    counts.forEach((count) => {
      max = Math.max(count, max);
    });
    return max;
  };

  const [{ ids, minute: sleepiestMinute }] = minutes
    .map((ids, minute) => ({ ids, minute }))
    .sort(({ ids: a }, { ids: b }) => {
      return maxAsleep(b) - maxAsleep(a);
    });

  const naptimes = ids.reduce((acc, guardId) => {
    return {
      ...acc,
      [guardId]: (acc[guardId] || 0) + 1,
    };
  }, {});

  const [[sleepiestGuard]] = Object.entries(naptimes).sort(
    ([_a, a], [_b, b]) => b - a
  );

  return +sleepiestGuard * sleepiestMinute;
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
};
