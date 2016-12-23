const idCounters = {};

export default function getUID(name) {
  if (!name) {
    throw Error('Argument "name" is required in getUID()');
  }

  if (!idCounters[name]) {
    idCounters[name] = 0;
  }

  const id = String(idCounters[name]++);

  return name + id;
}
