const readLines = require("../read-input");

const TEST = false && [
  "<x=-1, y=0, z=2>",
  "<x=2, y=-10, z=-7>",
  "<x=4, y=-8, z=8>",
  "<x=3, y=5, z=-1>"
];

const printVal = num => {
  return num < 0 ? String(num) : ` ${num}`;
};

const printPosition = ({ x, y, z }) => {
  return `pos=<x=${printVal(x)}, y=${printVal(y)}, z=${printVal(z)}>`;
};

const printVelocity = ({ x, y, z }) => {
  return `vel=<x=${printVal(x)}, y=${printVal(y)}, z=${printVal(z)}>`;
};

const printMoons = moons => {
  moons.forEach(moon => {
    console.log(
      `${printPosition(moon.position)}, ${printVelocity(moon.velocity)}`
    );
  });
};

const deltaP = (a, b, dimension) => {
  if (a[dimension] === b[dimension]) {
    return 0;
  }
  if (a[dimension] > b[dimension]) {
    return -1;
  }
  return 1;
};

const applyGravity = (moon, others) => {
  return others.reduce((velocity, otherMoon) => {
    const val = {
      x: velocity.x + deltaP(moon.position, otherMoon.position, "x"),
      y: velocity.y + deltaP(moon.position, otherMoon.position, "y"),
      z: velocity.z + deltaP(moon.position, otherMoon.position, "z")
    };
    return val;
  }, moon.velocity);
};

const sum = ({ x, y, z }) => {
  return Math.abs(x) + Math.abs(y) + Math.abs(z);
};

readLines("./day-12/input", TEST)
  .then(lines => {
    return lines.map((line, i) => {
      const [x, y, z] = line
        .replace(">", "")
        .replace("<", "")
        .replace(" ", "")
        .split(",")
        .map(v => +v.split("=")[1]);
      return {
        id: i,
        position: { x, y, z },
        velocity: { x: 0, y: 0, z: 0 }
      };
    });
  })
  .then(moons => {
    let i = 0;
    do {
      console.log(`After ${i++} steps:`);
      printMoons(moons);
      if (i > 1000) {
        return moons;
      }

      // Apply gravity
      const velocities = moons.map(moon => {
        return applyGravity(
          moon,
          moons.filter(m => m.id !== moon.id)
        );
      });

      // Apply the velocity to the position
      velocities.forEach((velocity, i) => {
        moons[i].position.x += velocity.x;
        moons[i].position.y += velocity.y;
        moons[i].position.z += velocity.z;
        moons[i].velocity = velocity;
      });
    } while (true);
  })
  .then(moons => {
    return moons.reduce((total, moon) => {
      const pot = sum(moon.position);
      const kin = sum(moon.velocity);
      return total + pot * kin;
    }, 0);
  })
  .then(output => {
    if (output !== undefined) {
      if (Array.isArray(output) || typeof output === "object") {
        console.log(JSON.stringify(output, null, 2));
      } else {
        console.log(output);
      }
    }
    process.exit(0);
  })
  .catch(ex => {
    console.error(ex);
    process.exit(1);
  });
