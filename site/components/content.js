import React from 'react';
import PropTypes from 'prop-types';
import parseFrontMatter from 'front-matter';

import Markdown from '../../components/markdown/markdown';
import {H1} from '../../components/heading/heading';
import styles from '../index.css';

import Example from './example';

const Content = ({title, type, content, examples, description}) => (
  <div className={styles.content}>
    <H1 caps={true}>{title}</H1>

    {type === 'md' && (
      <Markdown source={parseFrontMatter(content).body}/>
    )}

    {description && (
      <Markdown source={description}/>
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
