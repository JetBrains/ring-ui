import searchIcon from '@jetbrains/icons/search';
import checkmarkIcon from '@jetbrains/icons/checkmark';
import pencilIcon from '@jetbrains/icons/pencil';
import add12pxIcon from '@jetbrains/icons/add-12px';
import add20pxIcon from '@jetbrains/icons/add-20px';
import chevronDownIcon from '@jetbrains/icons/chevron-down';
import starFilledIcon from '@jetbrains/icons/star-filled';
import okIcon from '@jetbrains/icons/ok';

import Icon from '../icon';

import styles from './icon.stories.module.css';

const allIcons = import.meta.glob('../../../node_modules/@jetbrains/icons/*.svg', {
  eager: true,
  query: '?raw',
  import: 'default',
});

const allLogos = import.meta.glob('../../../node_modules/@jetbrains/logos/**/*.svg', {
  eager: true,
  query: '?raw',
  import: 'default',
});

export default {
  title: 'Components/Icon',

  parameters: {
    notes: 'Displays an icon.',
  },
};

export const basic = () => (
  <div>
    <Icon glyph={checkmarkIcon} className={styles.ringIcon} color={Icon.Color.MAGENTA} />
    <Icon glyph={searchIcon} className={styles.ringIcon} />
    <Icon glyph={pencilIcon} className={styles.ringIcon} />
  </div>
);

basic.storyName = 'basic';

export const inText = () => (
  <div className={styles.icons}>
    {'Some text '}
    <Icon glyph={chevronDownIcon} />
    {' Text '}
    <Icon glyph={add12pxIcon} />
    {' text '}
    <Icon glyph={starFilledIcon} />
    {' text '}
    <Icon glyph={okIcon} />
    {' Text '}
    <Icon glyph={add20pxIcon} />
    <div className={styles.underline} />
  </div>
);

inText.storyName = 'in text';

export const allIconsList = () => (
  <div className={styles.iconExampleContainer}>
    {Object.entries(allIcons).map(([name, src]) => (
      <div className={styles.ringIconExample} key={name}>
        <Icon glyph={src as string} className={styles.ringIcon} />
        {name.split('/').pop()}
      </div>
    ))}
  </div>
);

allIconsList.storyName = 'all icons list';

export const jetBrainsProductLogosList = () => (
  <div>
    {Object.entries(allLogos)
      .filter(([name]) => !/icon\.svg/.test(name))
      .map(([name, src]) => (
        <Icon glyph={src as string} key={name} title={name.slice(2)} className={styles.ringIcon} />
      ))}
  </div>
);

jetBrainsProductLogosList.storyName = 'JetBrains product logos list';

jetBrainsProductLogosList.parameters = {
  screenshots: {skip: true}, // Logos example is too big and have no much sense to test
};
