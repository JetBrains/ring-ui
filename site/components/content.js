import React, {PropTypes} from 'react';
import classNames from 'classnames';
import parseFrontMatter from 'front-matter';

import Markdown from 'ring-ui/components/markdown/markdown';

import Example from './example';

import styles from '../index.css';

const Content = ({title, type, content, examples, description}) => (
  <div className={classNames(styles.content, 'markdown-body')}>
    <h1>{title}</h1>

    {type === 'md' && (
      <Markdown source={parseFrontMatter(content).body} />
    )}

    {description && (
      <Markdown source={description} />
    )}

    {examples && examples.map(example =>
      <Example
        {...example}
        key={example.name}
      />
    )}
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
