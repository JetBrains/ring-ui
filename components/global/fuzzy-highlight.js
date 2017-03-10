/** https://github.com/bevacqua/fuzzysearch + highlighting with Markdown */

const marker = '**';

export default function fuzzyHighlight(needle, haystack) {
  const result = (matched, highlight = haystack) => ({matched, highlight});
  const hlen = haystack.length;
  const nlen = needle.length;
  if (nlen > hlen) {
    return result(false);
  }
  if (nlen === hlen) {
    const matched = needle === haystack;
    return result(matched, matched ? `${marker}${haystack}${marker}` : haystack);
  }
  let highlight = '';
  let on = false;
  let j = 0;
  /* eslint-disable no-labels */
  outer: for (let i = 0; i < nlen; i++) {
    const nch = needle[i].toLowerCase();
    while (j < hlen) {
      const hch = haystack[j++];
      const match = hch.toLowerCase() === nch;
      // Don't turn highlight on for space characters
      const nextOn = match && /\S/.test(hch);
      if (nextOn !== on) {
        highlight += marker;
      }
      highlight += hch;
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
