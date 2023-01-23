export function copyTextToClipboard(str: string) {
  const el = document.createElement('textarea');
  el.value = str;
  el.setAttribute('readonly', '');
  el.style.position = 'absolute';
  el.style.left = '-9999px';

  document.body.appendChild(el);

  // Should restore previous selection
  const selected =
    document.getSelection()!.rangeCount > 0
      ? document.getSelection()!.getRangeAt(0)
      : false;

  el.select();

  document.execCommand('copy');
  document.body.removeChild(el);

  if (selected) {
    document.getSelection()!.removeAllRanges();
    document.getSelection()!.addRange(selected);
  }
}

export function copyHTMLToClipboard(str: string) {
  const el = document.createElement('div');
  el.innerHTML = str;
  el.setAttribute('readonly', '');
  el.style.position = 'absolute';
  el.style.left = '-9999px';

  document.body.appendChild(el);

  // Should restore previous selection
  const selected =
    document.getSelection()!.rangeCount > 0
      ? document.getSelection()!.getRangeAt(0)
      : false;

  window.getSelection()?.removeAllRanges();
  const range = document.createRange();
  range.selectNode(el);
  window.getSelection()?.addRange(range);
  document.execCommand('copy');
  window.getSelection()?.removeAllRanges();

  document.execCommand('copy');
  document.body.removeChild(el);

  if (selected) {
    document.getSelection()!.addRange(selected);
  }
}
