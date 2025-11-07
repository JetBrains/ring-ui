import {type RowProps} from './row';

import styles from './grid.css';

const modifierKeys = [
  'start',
  'center',
  'end', // text-align, justify-content
  'around',
  'between', // justify-content
  'top',
  'middle',
  'baseline',
  'bottom', // align-items
  'first',
  'last', // order
] as const;

/**
 * Converts xs="middle" to class "middle-xs"
 * @param {Object} props incoming props
 * @mockReturnValue {Array} result modifier classes
 */
export function getModifierClassNames(props: RowProps) {
  return modifierKeys.reduce((result: string[], key) => {
    if (props[key]) {
      return result.concat(styles[`${key}-${props[key]}`]);
    }
    return result;
  }, []);
}
