export function getElementHeight(element: HTMLElement | null) {
  if (!element || !element?.getBoundingClientRect) {
    return 0;
  }

  return element.getBoundingClientRect().height;
}

export const toPx = (value: number) => `${value}px`;
