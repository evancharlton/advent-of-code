const fs = require("fs");
const readline = require("readline");

const getMasses = () => {
  return new Promise(resolve => {
    const masses = [];
    readline
      .createInterface({
        input: fs.createReadStream("./day-1/input")
      })
      .on("line", line => {
        masses.push(Number(line));
      })
      .on("close", () => {
        resolve(masses);
      });
  });
};

const getFuel = mass => {
  const fuel = Math.floor(mass / 3) - 2;
  if (fuel < 0) {
    return 0;
  }
  return fuel + getFuel(fuel);
};

getMasses()
  .then(masses => {
    return masses.reduce((tot, mass) => {
      return tot + getFuel(mass);
    }, 0);
  })
  .then(total => {
    console.log("Total:", total);
  })
  .then(() => {
    process.exit(0);
  })
  .catch(ex => {
    console.error(ex);
    process.exit(1);
  });
