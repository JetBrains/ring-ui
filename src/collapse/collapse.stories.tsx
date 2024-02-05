import React, {useState} from 'react';

import ChevronDownIcon from '@jetbrains/icons/chevron-down';

import ChevronUpIcon from '@jetbrains/icons/chevron-up';

import Button from '../button/button';
import Icon from '../icon/icon';

import LoaderInline from '../loader-inline/loader-inline';

import Collapse from './collapse';
import CollapseContent from './collapse-content';
import CollapseControl from './collapse-control';

import styles from './collapse.stories.css';

export default {
  title: 'Components/Collapse',

  parameters: {
    notes: 'The "Collapse" component hides content and shows more when clicked, saving space and keeping it tidy.',

    hermione: {
      actions: [
        {type: 'click', selector: '[data-test~=ring-collapse-control]'}
      ]
    }
  }
};
const text = `This is very long text! This is very long text! This is very long text! This is very
            long text! This is very long text! This is very long text! This is very long text! This
            is very long text! This is very long text! This is very long text! This is very long
            text! This is very long text! This is very long text! This is very long text! This is
            very long text! This is very long text! This is very long text! This is very long text!
            This is very long text! This is very long text! This is very long text!`;

export const Basic = () => (
  <div className={styles.container}>
    <Collapse>
      <CollapseControl>
        {(collapsed: boolean) => <Button>{collapsed ? 'Show more' : 'Show less'}</Button>}
      </CollapseControl>
      <CollapseContent>{text}</CollapseContent>
    </Collapse>
  </div>
);

export const ShowOnExtend = () => {
  const [showDelayedContent, setShowDelayedContent] = useState(false);

  const onChange = () => {
    setTimeout(() => {
      setShowDelayedContent(true);
    }, 1000);
  };

  return (
    <div className={`${styles.container} ${styles.border}`}>
      <Collapse onChange={onChange}>
        <CollapseControl>
          {(collapsed: boolean) => <Button>{collapsed ? 'Show more' : 'Show less'}</Button>}
        </CollapseControl>
        <CollapseContent>
          <div className={styles.loaderWrapper}>
            {showDelayedContent
              ? (
                <div className={styles.content}>loaded content</div>
              )
              : (
                <LoaderInline/>
              )}
          </div>
        </CollapseContent>
      </Collapse>
    </div>
  );
};

ShowOnExtend.storyName = 'Show content on extending';

export const TriggerUnderContent = () => (
  <div className={styles.container}>
    <Collapse>
      <CollapseContent>{text}</CollapseContent>
      <CollapseControl>
        {(collapsed: boolean) => <Button>{collapsed ? 'Show more' : 'Show less'}</Button>}
      </CollapseControl>
    </Collapse>
  </div>
);

TriggerUnderContent.storyName = 'Trigger placed under collapsed content';

export const WithIcon = () => (
  <div className={styles.container}>
    <Collapse>
      <CollapseControl>
        {(collapsed: boolean) =>
          (collapsed
            ? (
              <Icon glyph={ChevronDownIcon} className={styles.check}/>
            )
            : (
              <Icon glyph={ChevronUpIcon} className={styles.check}/>
            ))
        }
      </CollapseControl>
      <CollapseContent>{text}</CollapseContent>
    </Collapse>
  </div>
);

WithIcon.storyName = 'The trigger with icon';

export const WithMinHeight = () => (
  <div className={styles.container}>
    <Collapse>
      <CollapseContent minHeight={85}>{text}</CollapseContent>
      <CollapseControl>
        {(collapsed: boolean) => <Button>{collapsed ? 'Show more' : 'Show less'}</Button>}
      </CollapseControl>
    </Collapse>
  </div>
);

WithMinHeight.storyName = 'With default min height';

export const AnimationDisable = () => (
  <div className={styles.container}>
    <Collapse>
      <CollapseControl>
        {(collapsed: boolean) => <Button>{collapsed ? 'Show more' : 'Show less'}</Button>}
      </CollapseControl>
      <CollapseContent disableAnimation>{text}</CollapseContent>
    </Collapse>
  </div>
);

AnimationDisable.storyName = 'With disabled animation';

export const WithDynamicContent = () => {
  const [content, setContent] = useState<Array<string>>([text]);

  const add = () => {
    setContent([...content, text]);
  };

  const remove = () => {
    content.shift();
    setContent([...content]);
  };

  return (
    <>
      <div className={styles.container}>
        <Button onClick={add}>Add more text</Button>
        <Button onClick={remove}>Remove text</Button>
      </div>
      <div className={`${styles.container} ${styles.border}`}>
        <Collapse>
          <CollapseControl>
            {(collapsed: boolean) => <Button>{collapsed ? 'Show more' : 'Show less'}</Button>}
          </CollapseControl>
          <CollapseContent>
            {content.map((line, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <div key={index}>{line}</div>
            ))}
          </CollapseContent>
        </Collapse>
      </div>
    </>
  );
};

WithDynamicContent.storyName = 'With dynamic content';
