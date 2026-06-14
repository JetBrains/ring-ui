export const keyboardFocusableAttrName = 'data-keyboard-focusable';
const temporaryTabIndexAttrName = 'data-temporary-tabindex';

export function focusRow(row: HTMLTableRowElement): void {
  if (!row.hasAttribute('tabindex')) {
    row.tabIndex = 0;
    row.setAttribute(temporaryTabIndexAttrName, '');
  }

  row.focus();
}

export function onKeyDownTbody(e: React.KeyboardEvent<HTMLTableSectionElement>): void {
  if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') {
    return;
  }

  const tbody = e.currentTarget;

  const currentRow = (e.target as HTMLElement).closest('tr');
  if (!(currentRow instanceof HTMLTableRowElement) || currentRow.parentElement !== tbody) {
    return;
  }

  let candidate: HTMLTableRowElement | null = currentRow;

  while (candidate) {
    candidate =
      e.key === 'ArrowUp'
        ? (candidate.previousElementSibling as HTMLTableRowElement | null)
        : (candidate.nextElementSibling as HTMLTableRowElement | null);

    if (candidate?.hasAttribute(keyboardFocusableAttrName)) {
      focusRow(candidate);
      e.preventDefault();
      return;
    }
  }
}

export function onBlurCaptureTbody(e: React.FocusEvent<HTMLTableSectionElement>): void {
  const tbody = e.currentTarget;
  if (!(e.target instanceof HTMLTableRowElement) || e.target.parentElement !== tbody) {
    return;
  }

  const row = e.target;
  if (row.hasAttribute(temporaryTabIndexAttrName)) {
    row.removeAttribute('tabindex');
    row.removeAttribute(temporaryTabIndexAttrName);
  }
}
