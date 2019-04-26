import React from 'react';
import {storiesOf} from '@storybook/html';

import reactDecorator from '../../.storybook/react-decorator';

import {
  SearchIcon,
  CheckmarkIcon,
  PencilIcon,
  Add10pxIcon,
  Add20pxIcon,
  ChevronDownIcon,
  StarFilledIcon
} from '../icon';

import * as allIcons from './icons';
import * as allLogos from './logos';

storiesOf('Components|Icon', module).
  addDecorator(reactDecorator()).
  add('basic', () => (
    <div>
      <CheckmarkIcon
        className="additional-class ring-icon"
        color={CheckmarkIcon.Color.MAGENTA}
      />
      <SearchIcon className="ring-icon"/>
      <PencilIcon className="ring-icon"/>
    </div>
  ), {
    cssresources: [{
      id: 'example-styles',
      picked: true,
      code: `
<style>
  .ring-icon {
    display: inline-block;
    margin: 8px;
    padding: 8px;
  }
</style>
      `
    }]
  }).
  add('in text', () => (
    <div className="icons">
      {'Some text '}
      <ChevronDownIcon/>
      {' Text '}
      <Add10pxIcon/>
      {' text '}
      <StarFilledIcon/>
      {' Text '}
      <Add20pxIcon/>
      <div className="underline"/>
    </div>
  ), {
    cssresources: [{
      id: 'example-styles',
      picked: true,
      code: `
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
</style>
      `
    }]
  }).
  add('all icons list', () => (
    <div className="icon-example__container">
      {Object.values(allIcons).map(Icon => (
        <Icon
          key={Icon}
          title={Icon.displayName}
          className="ring-icon"
        />
      ))}
    </div>
  ), {
    cssresources: [{
      id: 'example-styles',
      picked: true,
      code: `
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
</style>
      `
    }]
  }).
  add('JetBrains product logos list', () => (
    <div>
      {Object.values(allLogos).map(Logo => (
        <Logo
          key={Logo}
          title={Logo.displayName}
          className="ring-icon"
        />
      ))}
    </div>
  ), {
    cssresources: [{
      id: 'example-styles',
      picked: true,
      code: `
<style>
  .ring-icon {
    display: inline-block;
    color: black;
    margin: 8px;
    padding: 8px;
  }
</style>
      `
    }]
  });
