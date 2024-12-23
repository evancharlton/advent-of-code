const data = (type = "") => {
  return require("./input")(__filename, { type, trim: true })
    .map(line => line.split('-').sort());
};

const part1 = (lines) => {
  const sets = lines.reduce((acc, [a, b]) => {
    acc[a] = acc[a] ?? [];
    acc[b] = acc[b] ?? [];

    acc[a].push(b);
    acc[b].push(a);

    return acc;
  }, {});

  return Object.entries(sets)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([computer, peers]) => {
      const links = [];
      for (let i = 0; i < peers.length - 1; i += 1) {
        for (let j = i + 1; j < peers.length; j += 1) {
          const a = peers[i];
          const b = peers[j];

          const linked = sets[a].includes(b)

          if (linked) {
            links.push([a, b, computer])
          }
        }
      }
      return links;
    })
    .flat()
    .filter(subnet => subnet.some(computer => computer.startsWith("t")))
    .map(subnet => subnet.sort().join(','))
    .sort()
    .filter((v, i, data) => i === 0 || data[i - 1] !== v)
    .length;
}

const part2 = (lines) => {
  const sets = lines.reduce((acc, [a, b]) => {
    acc[a] = acc[a] ?? [];
    acc[b] = acc[b] ?? [];

    acc[a].push(b);
    acc[b].push(a);

    acc[a].sort();
    acc[b].sort();

    return acc;
  }, {});

  return Object.entries(sets)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([computer, peers]) => {
      const subnets = [];
      const N = peers.length
      let max = 2;
      for (let p = 0b11; p < Math.pow(2, N); p += 1) {
        const candidates = peers
          .filter((_, i) => p >> i & 0x1)
          .sort()

        if (candidates.length < max) {
          continue;
        }

        const connected = candidates
          .every(peerId => candidates
            .filter(id => id !== peerId)
            .every(id => sets[id]
              .includes(peerId)))

        if (!connected) {
          continue;
        }

        subnets.push([computer, ...candidates])
        max = candidates.length;
      }

      return subnets;
    })
    .flat()
    .map(subnet => subnet.sort().join(','))
    .sort((a, b) => b.length - a.length)
    .filter((v, i, data) => i === 0 || data[i - 1] !== v)[0];
};

if (process.argv.includes(__filename.replace(/\.[jt]s$/, ""))) {
  console.log(`Part 1:`, part1(data(process.argv[2] || "")));
  console.log(`Part 2:`, part2(data(process.argv[2] || "")));
}

module.exports = {
  data,
  part1,
  part2,
};
