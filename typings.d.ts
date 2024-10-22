declare module '*.css' {
  const styles: Record<string, string>;
  export default styles;
}

declare module '*.svg' {
  const source: string;
  export default source;
}
declare module '*.md' {
  const source: string;
  export default source;
}
declare module '*.txt' {
  const source: string;
  export default source;
}

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
