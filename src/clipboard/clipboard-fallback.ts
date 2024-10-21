export function copyTextToClipboard(str: string) {
  const el = document.createElement('textarea');
  el.value = str;
  el.setAttribute('readonly', '');
  el.style.position = 'absolute';
  el.style.left = '-9999px';

  document.body.appendChild(el);

  const selection = document.getSelection();
  // Should restore previous selection
  const selected = selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : false;

  el.select();

  document.execCommand('copy');
  document.body.removeChild(el);

  if (selected && selection) {
    selection.removeAllRanges();
    selection.addRange(selected);
  }
}

export function copyHTMLToClipboard(str: string) {
  const el = document.createElement('div');
  el.innerHTML = str;
  el.setAttribute('readonly', '');
  el.style.position = 'absolute';
  el.style.left = '-9999px';

  document.body.appendChild(el);

  const selection = document.getSelection();
  // Should restore previous selection
  const selected = selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : false;

  selection?.removeAllRanges();
  const range = document.createRange();
  range.selectNode(el);
  selection?.addRange(range);
  document.execCommand('copy');
  selection?.removeAllRanges();

  document.execCommand('copy');
  document.body.removeChild(el);

  if (selected && selection) {
    selection.addRange(selected);
  }
}
