const readLines = require("../read-input");

const execute = (width, height) => {
  return readLines("./day-8/input")
    .then(([data]) => {
      return data.split("").map(v => +v);
    })
    .then(pixels => {
      const layers = [];
      for (let i = 0; i < pixels.length; i += 1) {
        const layer = Math.floor(i / (width * height));
        if (!layers[layer]) {
          layers.push([]);
        }
        layers[layer].push(pixels[i]);
      }
      return layers;
    })
    .then(layers => {
      return layers.map(layer => {
        return layer.reduce((acc, pixel) => {
          return {
            ...acc,
            [pixel]: (acc[pixel] || 0) + 1
          };
        }, {});
      });
    })
    .then(layerPixelCounts => {
      return layerPixelCounts.sort((a, b) => {
        return a[0] - b[0];
      })[0];
    })
    .then(leastZeroes => {
      return leastZeroes[1] * leastZeroes[2];
    });
};

execute(25, 6)
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
