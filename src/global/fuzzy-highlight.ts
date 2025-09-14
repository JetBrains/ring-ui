/** https://github.com/bevacqua/fuzzysearch + highlighting with Markdown */

interface Match {from: number; to: number}

export default function fuzzyHighlight(needle: string, haystack: string, caseSensitive = false) {
  const ndl = caseSensitive ? needle : needle.toLowerCase();
  const hstck = caseSensitive ? haystack : haystack.toLowerCase();
  const result = (matched: boolean, matches: Match[] = []) => {
    let highlight = haystack;
    if (matches.length > 0) {
      highlight = '';
      let prevMatch = {to: 0};
      for (const match of matches) {
        highlight += `${haystack.slice(prevMatch.to, match.from)}**${haystack.slice(match.from, match.to)}**`;
        prevMatch = match;
      }
      highlight += haystack.slice(prevMatch.to);
    }
    return {matched, matches, highlight};
  };
  const hlen = hstck.length;
  const nlen = ndl.length;
  if (nlen > hlen) {
    return result(false);
  }
  if (nlen === hlen) {
    const matched = ndl === hstck;
    return result(matched, matched ? [{from: 0, to: haystack.length}] : []);
  }
  let on = false;
  let j = 0;
  const matches = [];
  let from = 0;
  /* eslint-disable no-labels */
  outer: for (let i = 0; i < nlen; i++) {
    const nch = ndl[i];
    while (j < hlen) {
      const hch = hstck[j];
      const match = hch === nch;
      // Don't turn highlight on for space characters
      const nextOn = match && /\S/.test(hch);
      if (nextOn && !on) {
        from = j;
      } else if (!nextOn && on) {
        matches.push({from, to: j});
      }
      j++;
      on = nextOn;
      if (match) {
        continue outer;
      }
    }
    return result(false);
  }
  /* eslint-enable */
  if (on) {
    matches.push({from, to: j});
  }
  return result(true, matches);
}
