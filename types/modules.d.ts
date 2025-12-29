declare module 'simply-uuid' {
  export function generate(): string;
}

declare module 'highlight.js/lib/core.js' {
  import hljs from 'highlight.js';

  export default hljs;
}

declare module 'combokeys/test/lib/key-event' {
  export function simulate(
    charCode: number,
    keyCode: number,
    modifiers?: ('shift' | 'ctrl' | 'alt' | 'meta')[],
    element?: Element,
    repeat?: number,
  ): void;
}

declare module 'scrollbar-width' {
  export default function getScrollbarWidth(recalculate?: boolean): number | null;
}

declare module '@jetbrains/postcss-require-hover' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  export default function plugin(): import('postcss').Plugin;
}
