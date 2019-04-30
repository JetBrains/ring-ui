import React from 'react';
import {storiesOf} from '@storybook/html';

import reactDecorator from '../../.storybook/react-decorator';
import Island, {AdaptiveIsland, Header, Content} from '../island/island';

storiesOf('Components|Island', module).
  addParameters({hermione: {captureSelector: '*[data-test~=ring-island]'}}).
  addDecorator(reactDecorator()).
  add('basic', () => (
    <Island>
      <Header border>Title</Header>
      <Content>Content</Content>
    </Island>
  )).
  add('with scroll', () => (
    <Island className="limited-island" narrow>
      <Header border>Title</Header>
      <Content fade>
        Lorem Ipsum is simply dummy text of the printing and typesetting
        industry. Lorem Ipsum has been the industry's standard dummy text ever
        since the 1500s, when an unknown printer took a galley of type and
        scrambled it to make a type specimen book. It has survived not only five
        centuries, but also the leap into electronic typesetting, remaining
        essentially unchanged.
      </Content>
    </Island>
  ), {
    storyStyles: `
<style>
  .limited-island {
    height: 200px;
    width: 200px;
  }
</style>
      `
  }).
  add('with resizeable header', () => (
    <AdaptiveIsland className="limited-island" narrow>
      <Header>Title</Header>
      <Content fade>
        Lorem Ipsum is simply dummy text of the printing and typesetting
        industry. Lorem Ipsum has been the industry's standard dummy text ever
        since the 1500s, when an unknown printer took a galley of type and
        scrambled it to make a type specimen book. It has survived not only five
        centuries, but also the leap into electronic typesetting, remaining
        essentially unchanged.
      </Content>
    </AdaptiveIsland>
  ), {
    storyStyles: `
<style>
  .limited-island {
    height: 200px;
    width: 200px;
  }
</style>
      `
  });
