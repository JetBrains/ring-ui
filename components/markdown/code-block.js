import React, {PropTypes} from 'react';

import Code from '../code/code';

const CodeBlock = ({language, literal}) => (
  <Code
    {...{language}}
    code={literal}
  />
);

CodeBlock.propTypes = {
  language: PropTypes.string,
  literal: PropTypes.string
};

export default CodeBlock;
