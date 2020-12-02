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
      const combined = [];
      for (let y = 0; y < height; y += 1) {
        const row = [];
        for (let x = 0; x < width; x += 1) {
          row.push(2);
        }
        combined[y] = row;
      }
      layers.forEach(layer => {
        for (let i = 0; i < layer.length; i += 1) {
          const y = Math.floor(i / width);
          const x = i % width;
          const existingValue = combined[y][x];
          if (existingValue === 2) {
            combined[y][x] = layer[i];
          }
        }
      });
      return combined;
    })
    .then(image => {
      return image
        .reduce((acc, row) => {
          return [
            ...acc,
            row
              .map(v => {
                switch (+v) {
                  case 0:
                    return "#";
                  case 1:
                    return " ";
                }
              })
              .join(" ")
          ];
        }, [])
        .join("\n");
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
