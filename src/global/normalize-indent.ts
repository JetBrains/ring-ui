export default function normalizeIndent(string: string) {
  const nonemptyRE = /\S/;
  const indentRE = /^\s*/;

  const lines = string.split(/\n/g);
  const linesCopy = [...lines];

  //remove empty lines at the beginning and the end
  for (const line of linesCopy) {
    if (nonemptyRE.test(line)) {
      break;
    } else {
      lines.shift();
    }
  }

  for (const line of linesCopy.reverse()) {
    if (nonemptyRE.test(line)) {
      break;
    } else {
      lines.pop();
    }
  }

  const indents = lines.filter(line => nonemptyRE.test(line)).map(line => line.match(indentRE)?.[0].length ?? 0);

  const minIndent = Math.min(...indents);

  return lines.map(line => line.slice(minIndent)).join('\n');
}
