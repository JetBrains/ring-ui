import ContentEditable from '../contenteditable';

import styles from './contenteditable.stories.module.css';

export default {
  title: 'Components/ContentEditable',

  parameters: {
    notes: 'Provides a ContentEditable component.',
  },
};

export const basic = () => (
  <div>
    <ContentEditable className={styles.myInput} aria-label='My input'>
      <span>
        text <b>bold text</b> text
      </span>
    </ContentEditable>
    <ContentEditable className={styles.myInput} aria-label='My input' disabled>
      <span>
        text <b>bold text</b> text
      </span>
    </ContentEditable>
  </div>
);

basic.storyName = 'ContentEditable';
