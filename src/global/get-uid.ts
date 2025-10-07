const idCounters: Record<string, number> = {};

function generateSalt() {
  // eslint-disable-next-line no-magic-numbers
  return (Date.now() * Math.random()).toString(36).substring(0, 4);
}

const salt = generateSalt();

export default function getUID(name: string) {
  if (!name) {
    throw Error('Argument "name" is required in getUID()');
  }

  if (!idCounters[name]) {
    idCounters[name] = 0;
  }

  const id = String(idCounters[name]++);

  return `${name}${id}-${salt}`;
}
