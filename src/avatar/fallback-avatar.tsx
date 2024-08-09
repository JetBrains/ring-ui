import {useMemo} from 'react';

import getUID from '../global/get-uid';

import {Size} from './avatar';

const colorPairs = [
  ['#60A800', '#D5CA00'],
  ['#21D370', '#03E9E1'],
  ['#3BA1FF', '#36E97D'],
  ['#00C243', '#00FFFF'],
  ['#4BE098', '#627FFF'],
  ['#168BFA', '#26F7C7'],
  ['#9D4CFF', '#39D3C3'],
  ['#0A81F6', '#0ACFF6'],
  ['#765AF8', '#5A91F8'],
  ['#9E54FF', '#0ACFF6'],
  ['#B345F1', '#669DFF'],
  ['#765AF8', '#C059EE'],
  ['#9039D0', '#C239D0'],
  ['#9F2AFF', '#FD56FD'],
  ['#AB3AF2', '#E40568'],
  ['#9F2AFF', '#E9A80B'],
  ['#D50F6B', '#E73AE8'],
  ['#ED5502', '#E73AE8'],
  ['#ED358C', '#DBED18'],
  ['#ED358C', '#F9902E'],
  ['#FF7500', '#FFCA00']
];

interface Position {
  x: number
  y: number
}

interface SizesEntry {
  radius: number
  text: Position
  fontSize: string
  textAnchor?: string
  underscore?: Position
  letterSpacing?: number
}

const Sizes: Record<number, SizesEntry> = {
  18: {
    radius: 2,
    text: {x: 9, y: 13},
    fontSize: '11px',
    textAnchor: 'middle'
  },
  24: {
    radius: 3,
    text: {x: 2, y: 13},
    fontSize: '11px',
    underscore: {x: 3, y: 17}
  },
  32: {
    radius: 3,
    text: {x: 3, y: 17},
    fontSize: '13px',
    letterSpacing: 1,
    underscore: {x: 4, y: 22}
  },
  40: {
    radius: 3,
    text: {x: 5, y: 19},
    fontSize: '15px',
    letterSpacing: 1,
    underscore: {x: 6, y: 28}
  }
};

const sizeKeys = Object.keys(Sizes).map(Number);

function extractLetters(name: string) {
  const names = name.split(/[\s._]+/).filter(Boolean).map(word => Array.from(word));
  if (names.length >= 2) {
    return names[0][0].toUpperCase() + names[1][0].toUpperCase();
  } else if (names.length === 1) {
    if (names[0].length >= 2) {
      return names[0].slice(0, 2).join('').toUpperCase();
    } else {
      return `${names[0][0].toUpperCase()}X`;
    }
  } else {
    return 'XX';
  }
}

// https://gist.github.com/hyamamoto/fd435505d29ebfa3d9716fd2be8d42f0#gistcomment-2775538
const BASE = 32;
function hashCode(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = Math.imul(BASE - 1, h) + s.charCodeAt(i) | 0;
  }

  return h;
}

export interface FallbackAvatarProps {
  username: string
  size: Size
  round: boolean | null | undefined
}

export default function FallbackAvatar({username, size, round}: FallbackAvatarProps) {
  const hash = Math.abs(hashCode(username.toLowerCase()));
  const [fromColor, toColor] = colorPairs[hash % colorPairs.length];
  const possibleSizeKeys = sizeKeys.filter(key => key >= size);
  const sizeKey = possibleSizeKeys.length > 0
    ? Math.min(...possibleSizeKeys)
    : Math.max(...sizeKeys);
  const sizes = Sizes[sizeKey];
  const radius = round ? '50%' : sizes.radius;
  const gradientId = useMemo(() => getUID('gradient-'), []);
  return (
    <svg viewBox={`0 0 ${sizeKey} ${sizeKey}`} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop stopColor={fromColor} offset="0"/>
          <stop stopColor={toColor} offset="1"/>
        </linearGradient>
      </defs>
      <g>
        <rect
          fill={`url(#${gradientId})`}
          x="0"
          y="0"
          width={sizeKey}
          height={sizeKey}
          rx={radius}
          ry={radius}
        />
        <text
          x={sizes.text.x}
          y={sizes.text.y}
          fontFamily="Arial, Helvetica, sans-serif"
          fontSize={sizes.fontSize}
          letterSpacing={sizes.letterSpacing}
          fill="#FFFFFF"
          textAnchor={sizes.textAnchor}
          cursor="default"
        >
          <tspan>{extractLetters(username)}</tspan>
          {sizes.underscore && <tspan x={sizes.underscore.x} y={sizes.underscore.y}>{'_'}</tspan>}
        </text>
        <title>{username}</title>
      </g>
    </svg>
  );
}
