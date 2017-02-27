import React, {PropTypes} from 'react';

import Example from './example';
import Markdown from './markdown';

const Block = ({description, examples}) => (
  <div>
    {description && (
      <Markdown source={description} />
    )}
    {examples.map(example =>
      <Example
        {...example}
        key={example.name}
      />
    )}
  </div>
);

Block.propTypes = {
  description: PropTypes.string,
  examples: PropTypes.arrayOf(PropTypes.shape(Example.propTypes))
};

export default Block;
