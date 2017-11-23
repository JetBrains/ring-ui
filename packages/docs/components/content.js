import React from 'react';
import PropTypes from 'prop-types';
import parseFrontMatter from 'front-matter';
import Markdown from '@jetbrains/ring-ui/components/markdown/markdown';
import {H1} from '@jetbrains/ring-ui/components/heading/heading';

import styles from './index.css';
import Example from './example';

const Content = ({title, type, content, examples, description}) => (
  <div className={styles.content}>
    {title !== 'Getting Started' && <H1>{title}</H1>}

    {type === 'md' && (
      <Markdown className={styles.mainText} source={parseFrontMatter(content).body}/>
    )}

    {description && (
      <Markdown className={styles.mainText} source={description}/>
    )}

    {examples && examples.map(example => (
      <Example
        {...example}
        key={example.name}
      />
    ))}
  </div>
);

Content.propTypes = {
  title: PropTypes.string,
  type: PropTypes.string,
  content: PropTypes.string,
  description: PropTypes.string,
  examples: PropTypes.arrayOf(PropTypes.shape(Example.propTypes))
};

export default Content;
