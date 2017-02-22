import React, {PropTypes} from 'react';
import parseFrontMatter from 'front-matter';

import Block from './block';
import Markdown from './markdown';

const Content = ({attrs, type, content, blocks}) => (
  <div className="markdown-body">
    <h1>{attrs.name || attrs.title}</h1>

    {type === 'md' &&
      <Markdown source={parseFrontMatter(content).body} />
    }

    {blocks && blocks.filter(block => block.attrs.description || block.examples.length).map(block =>
      <Block
        {...block}
        key={JSON.stringify(block.attrs)}
      />
    )}
  </div>
);

Content.propTypes = {
  attrs: PropTypes.shape({
    name: PropTypes.string,
    title: PropTypes.string
  }),
  type: PropTypes.string,
  content: PropTypes.string,
  blocks: PropTypes.arrayOf(PropTypes.shape(Block.propTypes))
};

export default Content;
