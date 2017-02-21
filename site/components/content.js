import React, {PropTypes} from 'react';

import Block from './block';

const Content = ({attrs, rendered, blocks}) => (
  <div className="app__content markdown-body">
    <h1>{attrs.name || attrs.title}</h1>

    {rendered &&
      <div dangerouslySetInnerHTML={{__html: rendered}} />
    }

    {blocks && blocks.map(block =>
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
  rendered: PropTypes.string,
  blocks: PropTypes.arrayOf(PropTypes.shape(Block.propTypes))
};

export default Content;
