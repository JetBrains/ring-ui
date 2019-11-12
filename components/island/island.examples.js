import React from 'react';

import reactDecorator from '../../.storybook/react-decorator';

import Island, {AdaptiveIsland, Header, Content} from './island';

export default {
  title: 'Components|Island',
  decorators: [reactDecorator()],

  parameters: {
    notes: 'Displays an island.',
    hermione: {captureSelector: '*[data-test~=ring-island]'}
  }
};

export const basic = () => (
  <Island>
    <Header border>Title</Header>
    <Content>Content</Content>
  </Island>
);

basic.story = {
  name: 'basic'
};

export const withScroll = () => (
  <Island className="limited-island" narrow>
    <Header border>Title</Header>
    <Content fade>
      {`Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
      been the industry's standard dummy text ever since the 1500s, when an unknown printer took a
      galley of type and scrambled it to make a type specimen book. It has survived not only five
      centuries, but also the leap into electronic typesetting, remaining essentially unchanged.`}
    </Content>
  </Island>
);

withScroll.story = {
  name: 'with scroll',

  parameters: {
    storyStyles: `
  <style>
    .limited-island {
      height: 200px;
      width: 200px;
    }
  </style>
        `
  }
};

export const withResizeableHeader = () => (
  <AdaptiveIsland className="limited-island" narrow>
    <Header>Title</Header>
    <Content fade>
      {`Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
      been the industry's standard dummy text ever since the 1500s, when an unknown printer took a
      galley of type and scrambled it to make a type specimen book. It has survived not only five
      centuries, but also the leap into electronic typesetting, remaining essentially unchanged.`}
    </Content>
  </AdaptiveIsland>
);

withResizeableHeader.story = {
  name: 'with resizeable header',

  parameters: {
    storyStyles: `
  <style>
    .limited-island {
      height: 200px;
      width: 200px;
    }
  </style>
        `
  }
};
