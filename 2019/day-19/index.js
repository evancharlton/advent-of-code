const readLines = require("../read-input");
const intcode = require("../intcode");

const WIDTH = +process.argv[2];
const HEIGHT = +process.argv[2];

const beamChecker = program => async (x, y) => {
  const inputs = [x, y];
  let output = 0;
  await intcode(
    program,
    () => {
      return inputs.shift();
    },
    pulled => {
      output = pulled;
    }
  );
  return output === 1;
};

readLines("./day-19/input")
  .then(([program]) => {
    const isPulling = beamChecker(program);

    const getBeamInfo = async row => {
      let x = 0;
      let inBeam = false;
      let beamStart = 0;
      while (true) {
        const pulling = await isPulling(x, row);
        if (pulling && !inBeam) {
          // Entered the beam
          inBeam = true;
          beamStart = x;
        } else if (!pulling && inBeam) {
          // Exited the beam
          inBeam = false;
          return { start: beamStart, width: x - beamStart };
        }
        x += 1;
      }
    };

    return Promise.resolve()
      .then(async () => {
        let y = 5;
        while (true) {
          const { width, start } = await getBeamInfo(y);
          if (width >= WIDTH) {
            return { col: start, row: y };
          }
          y += 1;
        }
      })
      .then(async ({ col, row }) => {
        // Okay, we know where we need to start the search. We know that fro
        // here onwards, all of the rows are wide enough. Now we just have to
        // find where the beam is tall enough.

        let x = col;
        let y = row;
        while (true) {
          const [tl, tr, ll, lr] = [
            await isPulling(x, y),
            await isPulling(x + (WIDTH - 1), y),
            await isPulling(x, y + (HEIGHT - 1)),
            await isPulling(x + (WIDTH - 1), y + (HEIGHT - 1))
          ];
          if (tl && tr && ll && lr) {
            return [x, y];
          }
          if (!tl) {
            // The beam has shifted right; move the area to the right.
            x += 1;
          } else {
            if (!tr) {
              // We walked off the end of the beam; drop down and move left.
              y += 1;
              x = col;
            } else if (!ll) {
              // The beam is too short; move the area to the right.
              x += 1;
            }
          }
        }
      });
  })
  .then(([x, y]) => {
    return x * 10000 + y;
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
