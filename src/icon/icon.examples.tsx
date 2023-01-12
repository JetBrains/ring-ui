import React from 'react';
import searchIcon from '@jetbrains/icons/search';
import checkmarkIcon from '@jetbrains/icons/checkmark';
import pencilIcon from '@jetbrains/icons/pencil';
import add10pxIcon from '@jetbrains/icons/add-10px';
import add20pxIcon from '@jetbrains/icons/add-20px';
import chevronDownIcon from '@jetbrains/icons/chevron-down';
import starFilledIcon from '@jetbrains/icons/star-filled';
import okIcon from '@jetbrains/icons/ok';

import reactDecorator from '../../.storybook/react-decorator';

import Icon from './icon';

const allIcons = require.context('../../node_modules/@jetbrains/icons', false, /\.js$/);
const allLogos = require.context('../../node_modules/@jetbrains/logos', true, /\.svg$/);

export default {
  title: 'Components/Icon',
  decorators: [reactDecorator()],

  parameters: {
    notes: 'Displays an icon.'
  }
};

export const basic = () => (
  <div>
    <Icon
      glyph={checkmarkIcon}
      className="additional-class ring-icon"
      color={Icon.Color.MAGENTA}
    />
    <Icon glyph={searchIcon} className="ring-icon"/>
    <Icon glyph={pencilIcon} className="ring-icon"/>
  </div>
);

basic.storyName = 'basic';

basic.parameters = {
  storyStyles: `
<style>
  .ring-icon {
    display: inline-block;
    margin: 8px;
    padding: 8px;
  }
</style>`
};

export const inText = () => (
  <div className="icons">
    {'Some text '}
    <Icon glyph={chevronDownIcon}/>
    {' Text '}
    <Icon glyph={add10pxIcon}/>
    {' text '}
    <Icon glyph={starFilledIcon}/>
    {' text '}
    <Icon glyph={okIcon}/>
    {' Text '}
    <Icon glyph={add20pxIcon}/>
    <div className="underline"/>
  </div>
);

inText.storyName = 'in text';

inText.parameters = {
  storyStyles: `
<style>
  .icons {
    position: relative;
  }

  .icons svg {
    background-color: #eeea;
  }

  .underline {
    position: absolute;
    width: 100%;
    left: 0;
    border-bottom: 0.1em solid rgba(0, 255, 0, 0.4);
    bottom: 0.3em;
  }
</style>`
};

export const allIconsList = () => (
  <div className="icon-example__container">
    {allIcons.keys().filter(key => !/(index|svgo\.config)\.js$/.test(key)).map(key => {
      const iconName = key.replace('./', '').replace('.js', '');

      return (
        <Icon glyph={allIcons(key)} key={key} title={iconName} className="ring-icon"/>
      );
    })}
  </div>
);

allIconsList.storyName = 'all icons list';

allIconsList.parameters = {
  storyStyles: `
<style>
  .icon-example__container {
    margin-left: -16px;
  }

  .ring-icon {
    display: inline-block;
    margin: 8px;
    padding: 8px;
    color: var(--ring-link-color);
  }

  .secondary {
    fill: var(--ring-link-hover-color);
  }
</style>`
};

export const jetBrainsProductLogosList = () => (
  <div>
    {allLogos.keys().map(key => (
      <Icon glyph={allLogos(key)} key={key} title={key.slice(2)} className="ring-icon"/>
    ))}
  </div>
);

jetBrainsProductLogosList.storyName = 'JetBrains product logos list';

jetBrainsProductLogosList.parameters = {
  hermione: {skip: true}, // Logos example is too big and have no much sense to test
  storyStyles: `
<style>
  .ring-icon {
    display: inline-block;
    color: black;
    margin: 8px;
    padding: 8px;
  }
</style>`
};
