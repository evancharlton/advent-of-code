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

        if (Number.isNaN(busID)) {
          return acc;
        }

        let { step, time } = acc;
        while ((time + i) % busID !== 0) {
          time += step;
        }

        return { step: step * busID, time };
      },
      { step: 0, time: 0 }
    );

  return time;
};

if (process.argv.includes(__filename.replace(/\.[jt]s$/, ""))) {
  console.log(`Part 1:`, part1(data(process.argv[2] || "")));

  console.log(`Part 2:`, part2({ schedules: "17,x,13,19" }));
  console.log(`Part 2:`, part2({ schedules: "67,7,59,61" }));
  console.log(`Part 2:`, part2({ schedules: "67,x,7,59,61" }));
  console.log(`Part 2:`, part2({ schedules: "67,7,x,59,61" }));
  console.log(`Part 2:`, part2({ schedules: "1789,37,47,1889" }));
  console.log(`Part 2:`, part2(data(process.argv[2] || "")));
}

// 440 915 240 570 129 088

module.exports = {
  data,
  part1,
  part2,
};
