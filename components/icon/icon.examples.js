import React from 'react';

import reactDecorator from '../../.storybook/react-decorator';


import * as allIcons from './icons';
import * as allLogos from './logos';

import {
  SearchIcon,
  CheckmarkIcon,
  PencilIcon,
  Add10pxIcon,
  Add20pxIcon,
  ChevronDownIcon,
  StarFilledIcon,
  OkIcon
} from '.';

export default {
  title: 'Components|Icon',
  decorators: [reactDecorator()],

  parameters: {
    notes: 'Displays an icon.'
  }
};

export const basic = () => (
  <div>
    <CheckmarkIcon className="additional-class ring-icon" color={CheckmarkIcon.Color.MAGENTA}/>
    <SearchIcon className="ring-icon"/>
    <PencilIcon className="ring-icon"/>
  </div>
);

basic.story = {
  name: 'basic',

  parameters: {
    storyStyles: `
  <style>
    .ring-icon {
      display: inline-block;
      margin: 8px;
      padding: 8px;
    }
  </style>`
  }
};

export const inText = () => (
  <div className="icons">
    {'Some text '}
    <ChevronDownIcon/>
    {' Text '}
    <Add10pxIcon/>
    {' text '}
    <StarFilledIcon/>
    {' text '}
    <OkIcon/>
    {' Text '}
    <Add20pxIcon/>
    <div className="underline"/>
  </div>
);

inText.story = {
  name: 'in text',

  parameters: {
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
  }
};

export const allIconsList = () => (
  <div className="icon-example__container">
    {Object.values(allIcons).map(Icon => (
      <Icon key={Icon} title={Icon.displayName} className="ring-icon"/>
    ))}
  </div>
);

allIconsList.story = {
  name: 'all icons list',

  parameters: {
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
  }
};

export const jetBrainsProductLogosList = () => (
  <div>
    {Object.values(allLogos).map(Logo => (
      <Logo key={Logo} title={Logo.displayName} className="ring-icon"/>
    ))}
  </div>
);

jetBrainsProductLogosList.story = {
  name: 'JetBrains product logos list',

  parameters: {
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
  }
};
