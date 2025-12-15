import Island, {AdaptiveIsland, Header, Content} from '../island';

import styles from './island.stories.module.css';

export default {
  title: 'Components/Island',

  parameters: {
    notes: 'Displays an island.',
    screenshots: {captureSelector: '*[data-test~=ring-island]'},
  },
};

export const basic = () => (
  <Island>
    <Header border>Title</Header>
    <Content>Content</Content>
  </Island>
);

basic.storyName = 'basic';

export const withScroll = () => (
  <Island className={styles.limitedIsland} narrow>
    <Header border>Title</Header>
    <Content fade tabIndex={0}>
      {`Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
      been the industry's standard dummy text ever since the 1500s, when an unknown printer took a
      galley of type and scrambled it to make a type specimen book. It has survived not only five
      centuries, but also the leap into electronic typesetting, remaining essentially unchanged.`}
    </Content>
  </Island>
);

withScroll.storyName = 'with scroll';

export const withResizeableHeader = () => (
  <AdaptiveIsland className={styles.limitedIsland} narrow>
    <Header>Title</Header>
    <Content fade tabIndex={0}>
      {`Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
      been the industry's standard dummy text ever since the 1500s, when an unknown printer took a
      galley of type and scrambled it to make a type specimen book. It has survived not only five
      centuries, but also the leap into electronic typesetting, remaining essentially unchanged.`}
    </Content>
  </AdaptiveIsland>
);

withResizeableHeader.storyName = 'with resizeable header';
