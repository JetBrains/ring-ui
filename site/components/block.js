import React, {PropTypes} from 'react';

import Example from './example';
import Markdown from './markdown';

const Block = ({attrs, examples}) => (
  <div>
    {attrs.description &&
      <Markdown source={attrs.description} />
    }
    {examples.map(example =>
      <Example
        {...example}
        key={example.attrs.name}
      />
    )}
  </div>
);

Block.propTypes = {
  attrs: PropTypes.shape({
    description: PropTypes.string
  }),
  examples: PropTypes.arrayOf(PropTypes.shape(Example.propTypes))
};

export default Block;
