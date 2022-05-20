const idCounters: Record<string, number> = {};

export default function getUID(name: string) {
  if (!name) {
    throw Error('Argument "name" is required in getUID()');
  }

  if (!idCounters[name]) {
    idCounters[name] = 0;
  }

  const id = String(idCounters[name]++);

  return name + id;
}
