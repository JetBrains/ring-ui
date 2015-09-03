import { createFactory } from 'react';

export default function factoryDecorate(target) {
  target.factory = createFactory(target);
}
