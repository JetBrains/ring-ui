import React, {PropTypes} from 'react';
import classNames from 'classnames';
import parseFrontMatter from 'front-matter';

import Block from './block';
import Example from './example';
import Markdown from './markdown';

import styles from '../index.css';

const Content = ({title, type, content, examples}) => (
  <div className={classNames(styles.content, 'markdown-body')}>
    <h1>{title}</h1>

    {type === 'md' && (
      <Markdown source={parseFrontMatter(content).body} />
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
  blocks: PropTypes.arrayOf(PropTypes.shape(Block.propTypes))
};

export default Content;
