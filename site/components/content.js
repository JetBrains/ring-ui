import React, {PropTypes} from 'react';
import classNames from 'classnames';
import parseFrontMatter from 'front-matter';

import Block from './block';
import Markdown from './markdown';

import styles from '../index.css';

const Content = ({title, type, content, blocks}) => (
  <div className={classNames(styles.content, 'markdown-body')}>
    <h1>{title}</h1>

    {type === 'md' && (
      <Markdown source={parseFrontMatter(content).body} />
    )}

    {blocks && blocks.map(block =>
      <Block
        {...block}
        key={block.description}
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
