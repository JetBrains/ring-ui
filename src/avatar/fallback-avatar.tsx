import {type SVGTextElementAttributes, useMemo} from 'react';

import getUID from '../global/get-uid';
import {Size} from './avatar-size';

const colorPairs = [
  ['#A5E074', '#E8E093'],
  ['#6AD8A2', '#79E98F'],
  ['#7FBAF6', '#7BEBB2'],
  ['#6DDC8C', '#97FFFF'],
  ['#8EE5C0', '#A2B6FF'],
  ['#73B4F5', '#78F8DC'],
  ['#BA8EFF', '#78DFD6'],
  ['#63AFF5', '#60E2F5'],
  ['#A192F7', '#93B2F7'],
  ['#B989FF', '#60E2F5'],
  ['#CA7EF7', '#9BBAF8'],
  ['#A192F7', '#CF94F4'],
  ['#AB7EE1', '#D58AE3'],
  ['#BE82FF', '#FFA0FF'],
  ['#C57EF2', '#F2799E'],
  ['#BE82FF', '#F2CC83'],
  ['#E16C9D', '#EF8AE8'],
  ['#F29766', '#EF8AE8'],
  ['#F27AA9', '#EAF087'],
  ['#F27AA9', '#FBBB8C'],
  ['#FFAB66', '#FFEBA0'],
];

interface Position {
  x: number | string;
  y: number | string;
}

interface Rectangle extends Position {
  width: number;
  height: number;
}

interface SizesEntry {
  radius: number;
  text: Position;
  fontSize: string;
  textAnchor?: SVGTextElementAttributes<SVGTextElement>['textAnchor'];
  dominantBaseline?: SVGTextElementAttributes<SVGTextElement>['dominantBaseline'];
  underscore?: Rectangle;
  letterSpacing?: number;
}

const SizesSquare: Record<Size, SizesEntry> = {
  [Size.Size16]: {
    radius: 4,
    text: {x: 7.5, y: 11},
    fontSize: '8px',
    textAnchor: 'middle',
  },
  [Size.Size18]: {
    radius: 4,
    text: {x: 9, y: 13},
    fontSize: '11px',
    textAnchor: 'middle',
  },
  [Size.Size20]: {
    radius: 4,
    text: {x: 2, y: 10},
    fontSize: '9px',
    underscore: {x: 3, y: 16, width: 7, height: 1},
  },
  [Size.Size24]: {
    radius: 4,
    text: {x: 2, y: 12},
    fontSize: '11px',
    underscore: {x: 3, y: 18.5, width: 9, height: 1.5},
  },
  [Size.Size28]: {
    radius: 4,
    text: {x: 2, y: 14},
    fontSize: '13px',
    underscore: {x: 3, y: 22, width: 11, height: 2},
  },
  [Size.Size32]: {
    radius: 4,
    text: {x: 3, y: 17},
    fontSize: '15px',
    letterSpacing: 1,
    underscore: {x: 4, y: 26, width: 12, height: 2},
  },
  [Size.Size40]: {
    radius: 4,
    text: {x: 3, y: 21},
    fontSize: '19px',
    letterSpacing: 1,
    underscore: {x: 5, y: 32, width: 15, height: 2.5},
  },
  [Size.Size48]: {
    radius: 4,
    text: {x: 3, y: 21},
    fontSize: '19px',
    letterSpacing: 1,
    underscore: {x: 5, y: 32, width: 15, height: 2.5},
  },
  [Size.Size56]: {
    radius: 4,
    text: {x: 4, y: 28},
    fontSize: '26px',
    letterSpacing: 1,
    underscore: {x: 7, y: 45, width: 21, height: 3.5},
  },
};

const SizesRound: Record<Size, SizesEntry> = {
  [Size.Size16]: {
    radius: 4,
    fontSize: '8px',
    text: {x: '50%', y: '54%'},
    textAnchor: 'middle',
    dominantBaseline: 'middle',
  },
  [Size.Size18]: {
    radius: 4,
    fontSize: '11px',
    text: {x: '50%', y: '54%'},
    textAnchor: 'middle',
    dominantBaseline: 'middle',
  },
  [Size.Size20]: {
    radius: 4,
    fontSize: '9px',
    text: {x: '50%', y: '54%'},
    textAnchor: 'middle',
    dominantBaseline: 'middle',
  },
  [Size.Size24]: {
    radius: 4,
    fontSize: '11px',
    text: {x: '50%', y: '54%'},
    textAnchor: 'middle',
    dominantBaseline: 'middle',
  },
  [Size.Size28]: {
    radius: 4,
    fontSize: '13px',
    text: {x: '50%', y: '54%'},
    textAnchor: 'middle',
    dominantBaseline: 'middle',
  },
  [Size.Size32]: {
    radius: 4,
    fontSize: '15px',
    text: {x: '50%', y: '54%'},
    textAnchor: 'middle',
    dominantBaseline: 'middle',
    letterSpacing: 1,
  },
  [Size.Size40]: {
    radius: 4,
    fontSize: '19px',
    letterSpacing: 1,
    text: {x: '50%', y: '54%'},
    textAnchor: 'middle',
    dominantBaseline: 'middle',
  },
  [Size.Size48]: {
    radius: 4,
    fontSize: '19px',
    letterSpacing: 1,
    text: {x: '50%', y: '54%'},
    textAnchor: 'middle',
    dominantBaseline: 'middle',
  },
  [Size.Size56]: {
    radius: 4,
    fontSize: '26px',
    letterSpacing: 1,
    text: {x: '50%', y: '54%'},
    textAnchor: 'middle',
    dominantBaseline: 'middle',
  },
};

function extractLetters(name: string) {
  const names = name
    .split(/[\s._]+/)
    .filter(Boolean)
    .map(word => Array.from(word));
  if (names.length >= 2) {
    return names[0][0].toUpperCase() + names[1][0].toUpperCase();
  } if (names.length === 1) {
    if (names[0].length >= 2) {
      return names[0].slice(0, 2).join('').toUpperCase();
    }
      return `${names[0][0].toUpperCase()}X`;

  }
    return 'XX';

}

// https://gist.github.com/hyamamoto/fd435505d29ebfa3d9716fd2be8d42f0#gistcomment-2775538
const BASE = 32;
function hashCode(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(BASE - 1, h) + s.charCodeAt(i)) | 0;
  }

  return h;
}

export interface FallbackAvatarProps {
  username: string;
  size: Size;
  round: boolean | null | undefined;
}

export default function FallbackAvatar({username, size, round}: FallbackAvatarProps) {
  const hash = Math.abs(hashCode(username.toLowerCase()));
  const [fromColor, toColor] = colorPairs[hash % colorPairs.length];
  const sizes = round ? SizesRound[size] : SizesSquare[size];
  const underscore = sizes.underscore;
  const radius = round ? '50%' : sizes.radius;
  const gradientId = useMemo(() => getUID('gradient-'), []);
  return (
    <svg viewBox={`0 0 ${size} ${size}`} xmlns='http://www.w3.org/2000/svg'>
      <defs>
        <linearGradient id={gradientId} x1='1' y1='1' x2='0' y2='0'>
          <stop stopColor={fromColor} offset='0' />
          <stop stopColor={toColor} offset='0.8' />
        </linearGradient>
      </defs>
      <g>
        <rect fill={`url(#${gradientId})`} x='0' y='0' width={size} height={size} rx={radius} ry={radius} />
        <text
          x={sizes.text.x}
          y={sizes.text.y}
          fontFamily="var(--ring-font-family, 'Arial, Helvetica, sans-serif')"
          fontSize={sizes.fontSize}
          fontWeight='600'
          letterSpacing={sizes.letterSpacing}
          fill='#FFFFFF'
          dominantBaseline={sizes.dominantBaseline}
          textAnchor={sizes.textAnchor}
          cursor='default'
        >
          <tspan>{extractLetters(username)}</tspan>
        </text>
        {underscore && (
          <rect fill='#FFFFFF' x={underscore.x} y={underscore.y} width={underscore.width} height={underscore.height} />
        )}
        <title>{username}</title>
      </g>
    </svg>
  );
}
