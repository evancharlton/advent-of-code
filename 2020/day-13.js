const data = (type = "") => {
  const lines = require("./input")(__filename, "\n", type);
  const [earliest, schedules] = lines;
  return { earliest: +earliest, schedules };
};

const part1 = ({ earliest, schedules }) => {
  const buses = schedules
    .split(",")
    .filter((s) => s !== "x")
    .map(Number);

  let now = earliest;
  while (true) {
    const departingBusId = buses.find((id) => {
      return now % id === 0;
    });
    if (departingBusId) {
      return departingBusId * (now - earliest);
    }
    now += 1;
  }
};

const part2 = ({ schedules }) => {
  const { time } = schedules
    .split(",")
    .map(Number)
    .reduce(
      (acc, busID, i) => {
        if (i === 0) {
          return { step: busID, time: busID };
        }

        // Check if the bus is out of service. If so, the multiplier doesn't
        // change.
        if (Number.isNaN(busID)) {
          return acc;
        }

        let { step, time } = acc;
        // Advance the clock <step> iterations at a time to find the next
        // time that the bus will be <i> ticks from leaving the station. This
        // will result in the stair-step pattern.
        while ((time + i) % busID !== 0) {
          time += step;
        }

        // We can now multiply the step by the ID (schedule) of the bus. This
        // works because this bus (& all of its earlier peers) will only be in
        // the desired configuration every <this> often. This lets us avoid
        // inspecting the irrelevant "bad" time-steps for the next bus.
        //
        // Put another way: it doesn't matter if the next bus is in alignment
        // if the previous buses (this one and all of its previous ones) aren't
        // also in their specified position.
        step *= busID;

        return { step, time };
      },
      { step: 0, time: 0 }
    );

  return time;
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
