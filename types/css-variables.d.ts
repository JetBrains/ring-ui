// eslint-disable-next-line react/no-typos
import 'react';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
type RingCSSProperties = import('../src/global/variables.interface').RingCSSProperties;

declare module 'react' {
  interface CSSProperties extends RingCSSProperties {}
}
