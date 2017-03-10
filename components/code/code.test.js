import 'dom4';
import React, {PureComponent} from 'react';
import {findDOMNode} from 'react-dom';
import {renderIntoDocument} from 'react-addons-test-utils';

import Code from './code';

describe('Code', () => {
  class Wrapper extends PureComponent {
    render() {
      return (
        <Code
          source=""
          {...this.props}
        />
      );
    }
  }

  const renderComponent = props => renderIntoDocument(<Wrapper {...props} />);

  it('should wrap children with pre', () => {
    findDOMNode(renderComponent()).should.match('pre');
  });

  it('should use passed className', () => {
    findDOMNode(renderComponent({className: 'test-class'})).should.match('.test-class');
  });

  // TODO Add more tests
});
