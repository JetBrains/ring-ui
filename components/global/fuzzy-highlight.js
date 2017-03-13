/** https://github.com/bevacqua/fuzzysearch + highlighting with Markdown */

const marker = '**';

export default function fuzzyHighlight(needle, haystack, caseSensitive = false) {
  const ndl = caseSensitive ? needle : needle.toLowerCase();
  const hstck = caseSensitive ? haystack : haystack.toLowerCase();
  const result = (matched, highlight = haystack) => ({matched, highlight});
  const hlen = hstck.length;
  const nlen = ndl.length;
  if (nlen > hlen) {
    return result(false);
  }
  if (nlen === hlen) {
    const matched = ndl === hstck;
    return result(matched, matched ? `${marker}${haystack}${marker}` : haystack);
  }
  let highlight = '';
  let on = false;
  let j = 0;
  /* eslint-disable no-labels */
  outer: for (let i = 0; i < nlen; i++) {
    const nch = ndl[i];
    while (j < hlen) {
      const hch = hstck[j];
      const match = hch === nch;
      // Don't turn highlight on for space characters
      const nextOn = match && /\S/.test(hch);
      if (nextOn !== on) {
        highlight += marker;
      }
      highlight += haystack[j++];
      on = nextOn;
      if (match) {
        continue outer;
      }
    }
    return result(false);
  }
  /* eslint-enable */
  if (on) {
    highlight += marker;
  }
  highlight += haystack.slice(j);
  return result(true, highlight);
}
